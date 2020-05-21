"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaTest = void 0;
const assert_1 = require("assert");
const aws_sdk_1 = require("aws-sdk");
const AWSMOCK = require("aws-sdk-mock");
const chai_1 = require("chai");
const lambdaLocal = require("lambda-local");
const mocha_1 = require("mocha");
const nock = require("nock");
const uuid_1 = require("uuid");
const AudioPlayerValidator_1 = require("./AudioPlayerValidator");
const CardValidator_1 = require("./CardValidator");
const DialogValidator_1 = require("./DialogValidator");
const EndSessionValidator_1 = require("./EndSessionValidator");
const QuestionMarkValidator_1 = require("./QuestionMarkValidator");
const SessionAttributeValidator_1 = require("./SessionAttributeValidator");
const SpeechValidator_1 = require("./SpeechValidator");
const VideoAppValidator_1 = require("./VideoAppValidator");
lambdaLocal.getLogger().level = 'error';
// Install mock for DynamoDB persistence
const dynamoDBMock = {
    getMock: () => undefined,
    putMock: () => undefined,
};
AWSMOCK.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
    // Do not inline; resolution has to take place on call
    dynamoDBMock.getMock(params, callback);
});
AWSMOCK.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
    // Do not inline; resolution has to take place on call
    dynamoDBMock.putMock(params, callback);
});
// Install UpsServiceClient mock
const upsServiceMock = {
    getProfileName: () => undefined,
    getProfileGivenName: () => undefined,
    getProfileEmail: () => undefined,
    getProfileMobileNumber: () => undefined,
};
class AlexaTest {
    constructor(handler, settings) {
        this.handler = handler;
        this.settings = settings;
        this.validators = [
            new SpeechValidator_1.SpeechValidator(),
            new DialogValidator_1.DialogValidator(),
            new SessionAttributeValidator_1.SessionAttributeValidator(),
            new QuestionMarkValidator_1.QuestionMarkValidator(),
            new EndSessionValidator_1.EndSessionValidator(),
            new AudioPlayerValidator_1.AudioPlayerValidator(),
            new VideoAppValidator_1.VideoAppValidator(),
            new CardValidator_1.CardValidator(),
        ];
    }
    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }
    /**
     * Activates mocking of DynamoDB backed attributes
     * @param {string} tableName name of the DynamoDB Table
     * @param {string} partitionKeyName the key to be used as id (default: id)
     * @param {string} attributesName the key to be used for the attributes (default: attributes)
     */
    withDynamoDBPersistence(tableName, partitionKeyName, attributesName) {
        'use strict';
        if (!tableName) {
            throw "'tableName' argument must be provided.";
        }
        this.dynamoDBTable = tableName;
        this.partitionKeyName = partitionKeyName || 'id';
        this.attributesName = attributesName || 'attributes';
        return this;
    }
    test(sequence, testDescription) {
        if (!this.handler) {
            throw 'The module is not initialized.';
        }
        if (!sequence) {
            throw "'sequence' argument must be provided.";
        }
        mocha_1.it(testDescription || 'returns the correct responses', (done) => {
            const testSettings = {
                appId: this.settings.appId,
                deviceId: this.settings.deviceId,
                userId: this.settings.userId,
                handler: this.handler,
                sessionId: `SessionId.${uuid_1.v4()}`,
                debug: this.settings.debug || false,
            };
            this.runSingleTest(testSettings, sequence, 0, undefined, done);
        });
    }
    runSingleTest(settings, sequence, sequenceIndex, attributes, done) {
        if (sequenceIndex >= sequence.length) {
            // all requests were executed
            done();
        }
        else {
            const currentItem = sequence[sequenceIndex];
            const request = currentItem.request;
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
            let invoker;
            if (typeof settings.handler === 'function') {
                invoker = this.invokeFunction(settings, currentItem, request);
            }
            else if (settings.handler.startsWith('lambda:')) {
                invoker = this.invokeLambda(settings.handler.substr(7), settings, currentItem, request);
            }
            else if (settings.handler.startsWith('cfn:')) {
                const cfnParts = settings.handler.split(':');
                invoker = this.invokeLambdaCloudformation(cfnParts[1], cfnParts[2], settings, currentItem, request);
            }
            else {
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
    async invokeLambdaCloudformation(stackName, logicalName, settings, currentItem, request) {
        const cfnRes = await new aws_sdk_1.CloudFormation().describeStackResource({
            StackName: stackName,
            LogicalResourceId: logicalName,
        }).promise();
        if (cfnRes.StackResourceDetail.ResourceType !== 'AWS::Lambda::Function') {
            throw 'CloudFormation resource must be of type AWS::Lambda::Function';
        }
        const lambdaName = cfnRes.StackResourceDetail.PhysicalResourceId;
        return this.invokeLambda(lambdaName, settings, currentItem, request);
    }
    async invokeLambda(name, settings, currentItem, request) {
        if (this.containsMockSettings(currentItem)) {
            throw 'Invalid test configuration found. Cannot mock DynamoDB or API calls when invoking remotely.';
        }
        const res = await new aws_sdk_1.Lambda().invoke({
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
    containsMockSettings(currentItem) {
        return currentItem.hasOwnProperty('storesAttributes') ||
            currentItem.hasOwnProperty('withProfile') ||
            currentItem.hasOwnProperty('withStoredAttributes');
    }
    invokeFunction(settings, currentItem, request) {
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
    mockDynamoDB(settings, currentItem) {
        if (this.dynamoDBTable) {
            dynamoDBMock.putMock = (params, callback) => {
                chai_1.expect(params).to.have.property('TableName', this.dynamoDBTable);
                chai_1.expect(params).to.haveOwnProperty('Item');
                chai_1.expect(params.Item).to.have.property(this.partitionKeyName, settings.userId);
                const storesAttributes = currentItem.storesAttributes;
                if (storesAttributes) {
                    for (const att in storesAttributes) {
                        if (storesAttributes.hasOwnProperty(att)) {
                            const storedAttr = params.Item[this.attributesName][att];
                            const expectedAttr = storesAttributes[att];
                            if (typeof expectedAttr === 'function') {
                                if (!expectedAttr(storedAttr)) {
                                    assert_1.fail(`the stored attribute ${att} did not contain the correct value. Value was: ${storedAttr}`);
                                }
                            }
                            else {
                                chai_1.expect(storedAttr).to.be.equal(expectedAttr);
                            }
                        }
                    }
                }
                callback(null, {});
            };
            dynamoDBMock.getMock = (params, callback) => {
                chai_1.expect(params).to.have.property('TableName', this.dynamoDBTable);
                chai_1.expect(params).to.haveOwnProperty('Key');
                chai_1.expect(params.Key).to.have.property(this.partitionKeyName, settings.userId);
                const Item = {};
                Item[this.partitionKeyName] = settings.userId;
                Item[this.attributesName] = currentItem.withStoredAttributes || {};
                callback(null, { TableName: this.dynamoDBTable, Item });
            };
        }
    }
    mockProfileAPI(currentItem) {
        const profileMock = nock('https://api.amazonalexa.com').persist();
        const nameInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.name');
        const givenNameInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.givenName');
        const emailInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.email');
        const mobileNumberInterceptor = profileMock.get('/v2/accounts/~current/settings/Profile.mobileNumber');
        if (currentItem.withProfile && currentItem.withProfile.name) {
            nameInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.name);
            });
        }
        else {
            nameInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.givenName) {
            givenNameInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.givenName);
            });
        }
        else {
            givenNameInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.email) {
            emailInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.email);
            });
        }
        else {
            emailInterceptor.reply(401, {});
        }
        if (currentItem.withProfile && currentItem.withProfile.mobileNumber) {
            mobileNumberInterceptor.reply(200, () => {
                return JSON.stringify(currentItem.withProfile.mobileNumber);
            });
        }
        else {
            mobileNumberInterceptor.reply(401, {});
        }
        return [
            nameInterceptor, givenNameInterceptor, emailInterceptor, mobileNumberInterceptor,
        ];
    }
}
exports.AlexaTest = AlexaTest;
//# sourceMappingURL=AlexaTest.js.map