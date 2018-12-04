/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {RequestEnvelope} from 'ask-sdk-model';
import {fail} from 'assert';
import * as AWSMOCK from 'aws-sdk-mock';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {expect} from 'chai';
import * as lambdaLocal from 'lambda-local';
import {it} from 'mocha';
import {v4} from 'uuid';
import {ResponseValidator, SequenceItem, SkillSettings} from '../types';
import {AudioPlayerValidator} from './AudioPlayerValidator';
import {CardValidator} from './CardValidator';
import {DialogValidator} from './DialogValidator';
import {EndSessionValidator} from './EndSessionValidator';
import {QuestionMarkValidator} from './QuestionMarkValidator';
import {SessionAttributeValidator} from './SessionAttributeValidator';
import {SpeechValidator} from './SpeechValidator';
import PutItemInput = DocumentClient.PutItemInput;
import GetItemInput = DocumentClient.GetItemInput;

lambdaLocal.getLogger().level = 'error';

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

export class AlexaTest {

    private readonly handler : Function;
    private settings : SkillSettings;
    private validators : ResponseValidator[];

    private dynamoDBTable : string;
    private partitionKeyName : string;
    private attributesName : string;

    constructor(handler : Function, settings : SkillSettings) {
        this.handler = handler;
        this.settings = settings;
        this.validators = [
            new SpeechValidator(),
            new DialogValidator(),
            new SessionAttributeValidator(),
            new QuestionMarkValidator(),
            new EndSessionValidator(),
            new AudioPlayerValidator(),
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
     * @param {string} partitionKeyName the key to be used as id (default: userId)
     * @param {string} attributesName the key to be used for the attributes (default: mapAttr)
     */
    public withDynamoDBPersistence(tableName : string, partitionKeyName? : string, attributesName? : string) : AlexaTest {
        'use strict';
        if (!tableName) {
            throw "'tableName' argument must be provided.";
        }
        this.dynamoDBTable = tableName;
        this.partitionKeyName = partitionKeyName || 'userId';
        this.attributesName = attributesName || 'mapAttr';
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

            if (this.dynamoDBTable) {
                dynamoDBMock.putMock = (params : PutItemInput, callback : Function) => {
                    console.log({params});
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
                    console.log({params});
                    expect(params).to.have.property('TableName', this.dynamoDBTable);
                    expect(params).to.haveOwnProperty('Key');
                    expect(params.Key).to.have.property(this.partitionKeyName, settings.userId);

                    const Item = {};
                    Item[this.partitionKeyName] = settings.userId;
                    Item[this.attributesName] = currentItem.withStoredAttributes || {};
                    callback(null, {TableName: this.dynamoDBTable, Item});
                };
            }

            lambdaLocal.execute({
                event: request,
                lambdaFunc: settings,
                lambdaHandler: 'handler',
                timeoutMs: 5000,
            }).then((response) => {
                if (response.toJSON) {
                    response = response.toJSON();
                }

                // console.log(response);

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

}

interface TestSettings {

    appId : string;
    userId : string;
    deviceId : string;
    handler : Function;
    sessionId : string;

}
