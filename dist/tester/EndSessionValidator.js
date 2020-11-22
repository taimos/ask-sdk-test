"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndSessionValidator = void 0;
const assert_1 = require("assert");
const types_1 = require("../types");
class EndSessionValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        // check the shouldEndSession flag
        const expectedShouldEndSession = response.response.shouldEndSession;
        if (currentItem.shouldEndSession === expectedShouldEndSession) {
            return;
        }
        let failMessage = `shouldEndSession was in an unexpected state. Expected: ${currentItem.shouldEndSession}. Actual: ${expectedShouldEndSession}`;
        if (currentItem.shouldEndSession === true && expectedShouldEndSession !== true) {
            failMessage = 'the response did not end the session';
        }
        else if (currentItem.shouldEndSession === false && expectedShouldEndSession !== false) {
            failMessage = 'the response ended the session';
        }
        else if (currentItem.shouldEndSession === undefined && expectedShouldEndSession !== undefined) {
            failMessage = 'end of session was not left in an undefined state';
        }
        assert_1.fail(failMessage);
    }
}
exports.EndSessionValidator = EndSessionValidator;
//# sourceMappingURL=EndSessionValidator.js.map