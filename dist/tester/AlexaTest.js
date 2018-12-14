"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const AWSMOCK = require("aws-sdk-mock");
const chai_1 = require("chai");
const lambdaLocal = require("lambda-local");
const mocha_1 = require("mocha");
const uuid_1 = require("uuid");
const AudioPlayerValidator_1 = require("./AudioPlayerValidator");
const CardValidator_1 = require("./CardValidator");
const DialogValidator_1 = require("./DialogValidator");
const EndSessionValidator_1 = require("./EndSessionValidator");
const QuestionMarkValidator_1 = require("./QuestionMarkValidator");
const SessionAttributeValidator_1 = require("./SessionAttributeValidator");
const SpeechValidator_1 = require("./SpeechValidator");
lambdaLocal.getLogger().level = 'error';
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
     * @param {string} partitionKeyName the key to be used as id (default: userId)
     * @param {string} attributesName the key to be used for the attributes (default: mapAttr)
     */
    withDynamoDBPersistence(tableName, partitionKeyName, attributesName) {
        'use strict';
        if (!tableName) {
            throw "'tableName' argument must be provided.";
        }
        this.dynamoDBTable = tableName;
        this.partitionKeyName = partitionKeyName || 'userId';
        this.attributesName = attributesName || 'mapAttr';
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
                    if (currentItem.withSessionAttributes.hasOwnProperty(newAttribute) && !request.session.attributes.hasOwnProperty(newAttribute)) {
                        request.session.attributes[newAttribute] = currentItem.withSessionAttributes[newAttribute];
                    }
                }
            }
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
exports.AlexaTest = AlexaTest;
//# sourceMappingURL=AlexaTest.js.map