/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { ResponseEnvelope } from 'ask-sdk-model';
import { fail } from 'assert';
import { expect } from 'chai';
import { ResponseValidator, SequenceItem } from '../types';

export class SpeechValidator extends ResponseValidator {

    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        let actualSay : string;
        if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'SSML') {
            actualSay = response.response.outputSpeech.ssml.substring(7);
            actualSay = actualSay.substring(0, actualSay.length - 8).trim();
        } else if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'PlainText') {
            actualSay = response.response.outputSpeech.text;
        }
        if (currentItem.says !== undefined) {
            if (Array.isArray(currentItem.says)) {
                expect(actualSay).to.be.oneOf(currentItem.says);
            } else if (typeof currentItem.says === 'function') {
                if (!currentItem.says(actualSay)) {
                    fail(`Speech validation failed. Value was: ${actualSay}`);
                }
            } else {
                expect(actualSay).to.equal(currentItem.says);
            }
        }
        if (currentItem.saysLike !== undefined) {
            expect(actualSay.indexOf(currentItem.saysLike) >= 0, `Speech did not contain specified text. Expected ${actualSay} to be like ${currentItem.saysLike}`).to.be.true;
        }
        if (currentItem.saysNothing) {
            expect(actualSay, 'Should have said nothing').to.be.undefined;
        }

        let actualReprompt : string;
        if (response.response && response.response.reprompt && response.response.reprompt.outputSpeech && response.response.reprompt.outputSpeech.type === 'SSML') {
            actualReprompt = response.response.reprompt.outputSpeech.ssml.substring(7);
            actualReprompt = actualReprompt.substring(0, actualReprompt.length - 8).trim();
        } else if (response.response && response.response.reprompt && response.response.reprompt.outputSpeech && response.response.reprompt.outputSpeech.type === 'PlainText') {
            actualReprompt = response.response.reprompt.outputSpeech.text;
        }
        if (currentItem.reprompts !== undefined) {
            if (Array.isArray(currentItem.reprompts)) {
                expect(actualReprompt).to.be.oneOf(currentItem.reprompts);
            } else if (typeof currentItem.reprompts === 'function') {
                if (!currentItem.reprompts(actualReprompt)) {
                    fail(`Reprompt validation failed. Value was: ${actualReprompt}`);
                }
            } else {
                expect(actualReprompt).to.equal(currentItem.reprompts);
            }
        }
        if (currentItem.repromptsLike !== undefined) {
            expect(actualReprompt.indexOf(currentItem.repromptsLike) >= 0, `Reprompt did not contain specified text. Expected ${actualReprompt} to be like ${currentItem.repromptsLike}`).to.be.true;
        }
        if (currentItem.repromptsNothing) {
            expect(actualReprompt, 'Should have reprompted nothing').to.be.undefined;
        }
    }

}
