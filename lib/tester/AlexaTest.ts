/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { RequestEnvelope } from 'ask-sdk-model';
import { fail } from 'assert';
import { CloudFormation as CFNClient, Lambda as LambdaClient } from 'aws-sdk';
import * as AWSMOCK from 'aws-sdk-mock';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { expect } from 'chai';
import PutItemInput = DocumentClient.PutItemInput;
import GetItemInput = DocumentClient.GetItemInput;
import * as lambdaLocal from 'lambda-local';
import { it } from 'mocha';
import * as nock from 'nock';
import { v4 } from 'uuid';
import { ResponseValidator, SequenceItem, SkillSettings } from '../types';
import { AudioPlayerValidator } from './AudioPlayerValidator';
import { CardValidator } from './CardValidator';
import { DialogValidator } from './DialogValidator';
import { EndSessionValidator } from './EndSessionValidator';
import { QuestionMarkValidator } from './QuestionMarkValidator';
import { SessionAttributeValidator } from './SessionAttributeValidator';
import { SpeechValidator } from './SpeechValidator';
import { VideoAppValidator } from './VideoAppValidator';

lambdaLocal.getLogger().level = 'error';

// Install mock for DynamoDB persistence
const dynamoDBMock : { getMock : (params : GetItemInput, callback : Function) => void; putMock : (params : PutItemInput, callback : Function) => void } = {
    getMock: () => undefined,
    putMock: () => undefined,
};
AWSMOCK.mock('DynamoDB.DocumentClient', 'get', (params : GetItemInput, callback : Function) => {
    // Do not inline; resolution has to take place on call
    dynamoDBMock.getMock(params, callback);
});
AWSMOCK.mock('DynamoDB.DocumentClient', 'put', (params : PutItemInput, callback : Function) => {
    // Do not inline; resolution has to take place on call
    dynamoDBMock.putMock(params, callback);
});

// Install UpsServiceClient mock
const upsServiceMock : { getProfileName : () => string; getProfileGivenName : () => string; getProfileEmail : () => string; getProfileMobileNumber : () => string; } = {
    getProfileName: () => undefined,
    getProfileGivenName: () => undefined,
    getProfileEmail: () => undefined,
    getProfileMobileNumber: () => undefined,
};

export class AlexaTest {

    private readonly handler : Function | string;
    private settings : SkillSettings;
    private validators : ResponseValidator[];

    private dynamoDBTable : string;
    private partitionKeyName : string;
    private attributesName : string;

    constructor(handler : Function | string, settings : SkillSettings) {
        this.handler = handler;
        this.settings = settings;
        this.validators = [
            new SpeechValidator(),
            new DialogValidator(),
            new SessionAttributeValidator(),
            new QuestionMarkValidator(),
            new EndSessionValidator(),
            new AudioPlayerValidator(),
            new VideoAppValidator(),
            new CardValidator(),
        ];
    }

    public addValidator(validator : ResponseValidator) : AlexaTest {
        this.validators.push(validator);
        return this;
    }

    /**
     * Activates mocking of DynamoDB backed attributes
     * @param {string} tableName name of the DynamoDB Table
     * @param {string} partitionKeyName the key to be used as id (default: id)
     * @param {string} attributesName the key to be used for the attributes (default: attributes)
     */
    public withDynamoDBPersistence(tableName : string, partitionKeyName? : string, attributesName? : string) : AlexaTest {
        'use strict';
        if (!tableName) {
            throw "'tableName' argument must be provided.";
        }
        this.dynamoDBTable = tableName;
        this.partitionKeyName = partitionKeyName || 'id';
        this.attributesName = attributesName || 'attributes';
        return this;
    }

    public test(sequence : SequenceItem[], testDescription? : string) : void {
        if (!this.handler) {
            throw 'The module is not initialized.';
        }
        if (!sequence) {
            throw "'sequence' argument must be provided.";
        }

        it(testDescription || 'returns the correct responses', (done) => {
            const testSettings : TestSettings = {
                appId: this.settings.appId,
                deviceId: this.settings.deviceId,
                userId: this.settings.userId,
                handler: this.handler,
                sessionId: `SessionId.${v4()}`,
                debug: this.settings.debug || false,
            };
            this.runSingleTest(testSettings, sequence, 0, undefined, done);
        });
    }

    private runSingleTest(settings : TestSettings, sequence : SequenceItem[], sequenceIndex : number, attributes : object, done : Function) : void {
        if (sequenceIndex >= sequence.length) {
            // all requests were executed
            done();
        } else {
            const currentItem = sequence[sequenceIndex];

            const request : RequestEnvelope = currentItem.request;
            request.session.new = (sequenceIndex === 0);
            request.session.attributes = attributes ? JSON.parse(JSON.stringify(attributes)) : {};
            request.session.sessionId = settings.sessionId;

            // adds values from withSessionAttributes to the session
            if (currentItem.withSessionAttributes) {
                for (const newAttribute in currentItem.withSessionAttributes) {
                    if (currentItem.withSessionAttributes.hasOwnProperty(newAttribute)) {
                        request.session.attributes[newAttribute] = currentItem.withSessionAttributes[newAttribute];
                    }
                }
            }

            if (currentItem.withUserAccessToken) {
                request.session.user.accessToken = currentItem.withUserAccessToken;
                request.context.System.user.accessToken = currentItem.withUserAccessToken;
            }

            let invoker : any;
            if (typeof settings.handler === 'function') {
                invoker = this.invokeFunction(settings, currentItem, request);
            } else if (settings.handler.startsWith('lambda:')) {
                invoker = this.invokeLambda(settings.handler.substr(7), settings, currentItem, request);
            } else if (settings.handler.startsWith('cfn:')) {
                const cfnParts = settings.handler.split(':');
                invoker = this.invokeLambdaCloudformation(cfnParts[1], cfnParts[2], settings, currentItem, request);
            } else {
                throw 'Invalid handler configuration';
            }

            invoker.then((response) => {
                if (settings.debug) {
                    console.log(JSON.stringify(response, null, 2));
                }

                this.validators.forEach((validator) => {
                    validator.validate(currentItem, response);
                });

                if (currentItem.callback) {
                    currentItem.callback(response);
                }
                this.runSingleTest(settings, sequence, sequenceIndex + 1, response.sessionAttributes, done);
            }).catch(done);
        }
    }

    private async invokeLambdaCloudformation(stackName : string, logicalName : string, settings : TestSettings, currentItem : SequenceItem, request : RequestEnvelope) : Promise<any> {
        const cfnRes = await new CFNClient().describeStackResource({
            StackName: stackName,
            LogicalResourceId: logicalName,
        }).promise();
        if (cfnRes.StackResourceDetail.ResourceType !== 'AWS::Lambda::Function') {
            throw 'CloudFormation resource must be of type AWS::Lambda::Function';
        }
        const lambdaName = cfnRes.StackResourceDetail.PhysicalResourceId;
        return this.invokeLambda(lambdaName, settings, currentItem, request);
    }

    private async invokeLambda(name : string, settings : TestSettings, currentItem : SequenceItem, request : RequestEnvelope) : Promise<any> {
        if (this.containsMockSettings(currentItem)) {
            throw 'Invalid test configuration found. Cannot mock DynamoDB or API calls when invoking remotely.';
        }
        const res = await new LambdaClient().invoke({
            FunctionName: name,
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(request),
        }).promise();

        const parsedResponse = JSON.parse(res.Payload.toString());
        if (res.FunctionError) {
            console.log(JSON.stringify(parsedResponse, null, 2));
        }
        return parsedResponse;
    }

    private containsMockSettings(currentItem : SequenceItem) : boolean {
        return currentItem.hasOwnProperty('storesAttributes') ||
        currentItem.hasOwnProperty('withProfile') ||
        currentItem.hasOwnProperty('withStoredAttributes');
    }

    private invokeFunction(settings : TestSettings, currentItem : SequenceItem, request : RequestEnvelope) : Promise<any> {
        this.mockDynamoDB(settings, currentItem);

        const interceptors = this.mockProfileAPI(currentItem);

        return lambdaLocal.execute({
            event: request,
            lambdaFunc: settings,
            lambdaHandler: 'handler',
            timeoutMs: 5000,
        }).then((response) => {
            // if (response.toJSON) {
            //     response = response.toJSON();
            // }
            interceptors.forEach((value) => nock.removeInterceptor(value));
            return response;
        });
    }

    private mockDynamoDB(settings : TestSettings, currentItem : SequenceItem) : void {
        if (this.dynamoDBTable) {
            dynamoDBMock.putMock = (params : PutItemInput, callback : Function) => {
                expect(params).to.have.property('TableName', this.dynamoDBTable);
                expect(params).to.haveOwnProperty('Item');
                expect(params.Item).to.have.property(this.partitionKeyName, settings.userId);
                const storesAttributes = currentItem.storesAttributes;
                if (storesAttributes) {
                    for (const att in storesAttributes) {
                        if (storesAttributes.hasOwnProperty(att)) {
                            const storedAttr = params.Item[this.attributesName][att];
                            const expectedAttr = storesAttributes[att];
                            if (typeof expectedAttr === 'function') {
                                if (!expectedAttr(storedAttr)) {
                                    fail(`the stored attribute ${att} did not contain the correct value. Value was: ${storedAttr}`);
                                }
                            } else {
                                expect(storedAttr).to.be.equal(expectedAttr);
                            }
                        }
                    }
                }
                callback(null, {});
            };
            dynamoDBMock.getMock = (params : GetItemInput, callback) => {
                expect(params).to.have.property('TableName', this.dynamoDBTable);
                expect(params).to.haveOwnProperty('Key');
                expect(params.Key).to.have.property(this.partitionKeyName, settings.userId);

                const Item = {};
                Item[this.partitionKeyName] = settings.userId;
                Item[this.attributesName] = currentItem.withStoredAttributes || {};
                callback(null, { TableName: this.dynamoDBTable, Item });
            };
        }
    }

    private mockProfileAPI(currentItem : SequenceItem) : object[] {
        const profileMock = nock('https://api.amazonalexa.com').persist();
        const nameInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.name');
        const givenNameInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.givenName');
        const emailInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.email');
        const mobileNumberInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.mobileNumber');

        if (currentItem.withProfile && currentItem.withProfile.name) {
            nameInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.name);
            });
        } else {
            nameInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.givenName) {
            givenNameInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.givenName);
            });
        } else {
            givenNameInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.email) {
            emailInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.email);
            });
        } else {
            emailInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.mobileNumber) {
            mobileNumberInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.mobileNumber);
            });
        } else {
            mobileNumberInterceptor.reply(401, {});
        }
        return [
            nameInterceptor, givenNameInterceptor, emailInterceptor, mobileNumberInterceptor,
        ];
    }

}

interface TestSettings {

    appId : string;
    userId : string;
    deviceId : string;
    handler : Function | string;
    sessionId : string;
    debug : boolean;

}
