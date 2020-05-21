"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionMarkValidator = void 0;
const assert_1 = require("assert");
const types_1 = require("../types");
class QuestionMarkValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        let actualSay;
        if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'SSML') {
            actualSay = response.response.outputSpeech.ssml.substring(7);
            actualSay = actualSay.substring(0, actualSay.length - 8).trim();
        }
        else if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'PlainText') {
            actualSay = response.response.outputSpeech.text;
        }
        let hasQuestionMark = false;
        for (let i = 0; actualSay && i < actualSay.length; i++) {
            const c = actualSay[i];
            if (c === '?' || c === '\u055E' || c === '\u061F' || c === '\u2E2E' || c === '\uFF1F') {
                hasQuestionMark = true;
                break;
            }
        }
        if (!currentItem.ignoreQuestionCheck && response.response.shouldEndSession !== false && hasQuestionMark) {
            assert_1.fail('Possible Certification Problem: The response ends the session but contains a question mark.');
        }
        if (!currentItem.ignoreQuestionCheck && response.response.shouldEndSession === false && !hasQuestionMark) {
            assert_1.fail('Possible Certification Problem: The response keeps the session open but does not contain a question mark.');
        }
    }
}
exports.QuestionMarkValidator = QuestionMarkValidator;
//# sourceMappingURL=QuestionMarkValidator.js.map