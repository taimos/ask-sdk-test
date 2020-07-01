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
        if (currentItem.shouldEndSession === true && response.response.shouldEndSession === false) {
            assert_1.fail('the response did not end the session');
        }
        else if (currentItem.shouldEndSession === false && response.response.shouldEndSession !== false) {
            assert_1.fail('the response ended the session');
        }
    }
}
exports.EndSessionValidator = EndSessionValidator;
//# sourceMappingURL=EndSessionValidator.js.map