"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionAttributeValidator = void 0;
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class SessionAttributeValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        if (currentItem.hasAttributes) {
            for (const att in currentItem.hasAttributes) {
                if (currentItem.hasAttributes.hasOwnProperty(att)) {
                    const attr = currentItem.hasAttributes[att];
                    if (typeof attr === 'function') {
                        if (!attr(response.sessionAttributes[att])) {
                            assert_1.fail(`The attribute ${att} did not contain the correct value. Value was: ${response.sessionAttributes[att]}`);
                        }
                    }
                    else {
                        chai_1.expect(response.sessionAttributes[att], `Session attribute ${att} failed`).to.deep.equal(attr);
                    }
                }
            }
        }
    }
}
exports.SessionAttributeValidator = SessionAttributeValidator;
//# sourceMappingURL=SessionAttributeValidator.js.map