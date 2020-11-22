"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechValidator = void 0;
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class SpeechValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        let actualSay;
        if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'SSML') {
            actualSay = response.response.outputSpeech.ssml.substring(7);
            actualSay = actualSay.substring(0, actualSay.length - 8).trim();
        }
        else if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'PlainText') {
            actualSay = response.response.outputSpeech.text;
        }
        if (currentItem.says !== undefined) {
            if (Array.isArray(currentItem.says)) {
                chai_1.expect(actualSay).to.be.oneOf(currentItem.says);
            }
            else if (typeof currentItem.says === 'function') {
                if (!currentItem.says(actualSay)) {
                    assert_1.fail(`Speech validation failed. Value was: ${actualSay}`);
                }
            }
            else {
                chai_1.expect(actualSay).to.equal(currentItem.says);
            }
        }
        if (currentItem.saysLike !== undefined) {
            chai_1.expect(actualSay.indexOf(currentItem.saysLike) >= 0, `Speech did not contain specified text. Expected ${actualSay} to be like ${currentItem.saysLike}`).to.be.true;
        }
        if (currentItem.saysNothing) {
            chai_1.expect(actualSay, 'Should have said nothing').to.be.undefined;
        }
        let actualReprompt;
        if (response.response && response.response.reprompt && response.response.reprompt.outputSpeech && response.response.reprompt.outputSpeech.type === 'SSML') {
            actualReprompt = response.response.reprompt.outputSpeech.ssml.substring(7);
            actualReprompt = actualReprompt.substring(0, actualReprompt.length - 8).trim();
        }
        else if (response.response && response.response.reprompt && response.response.reprompt.outputSpeech && response.response.reprompt.outputSpeech.type === 'PlainText') {
            actualReprompt = response.response.reprompt.outputSpeech.text;
        }
        if (currentItem.reprompts !== undefined) {
            if (Array.isArray(currentItem.reprompts)) {
                chai_1.expect(actualReprompt).to.be.oneOf(currentItem.reprompts);
            }
            else if (typeof currentItem.reprompts === 'function') {
                if (!currentItem.reprompts(actualReprompt)) {
                    assert_1.fail(`Reprompt validation failed. Value was: ${actualReprompt}`);
                }
            }
            else {
                chai_1.expect(actualReprompt).to.equal(currentItem.reprompts);
            }
        }
        if (currentItem.repromptsLike !== undefined) {
            chai_1.expect(actualReprompt.indexOf(currentItem.repromptsLike) >= 0, `Reprompt did not contain specified text. Expected ${actualReprompt} to be like ${currentItem.repromptsLike}`).to.be.true;
        }
        if (currentItem.repromptsNothing) {
            chai_1.expect(actualReprompt, 'Should have reprompted nothing').to.be.undefined;
        }
    }
}
exports.SpeechValidator = SpeechValidator;
//# sourceMappingURL=SpeechValidator.js.map