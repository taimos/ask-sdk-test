"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogValidator = void 0;
const chai_1 = require("chai");
const types_1 = require("../types");
class DialogValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        if (currentItem.elicitsSlot) {
            const elicitSlotDirective = response.response.directives
                ? response.response.directives.find((value) => value.type === 'Dialog.ElicitSlot')
                : undefined;
            const slot = elicitSlotDirective ? elicitSlotDirective.slotToElicit : '';
            chai_1.expect(slot).to.equal(currentItem.elicitsSlot, `The response did not ask Alexa to elicit the slot ${currentItem.elicitsSlot}`);
        }
        if (currentItem.elicitsForIntent) {
            const elicitSlotDirective = response.response.directives
                ? response.response.directives.find((value) => value.type === 'Dialog.ElicitSlot')
                : undefined;
            const intent = elicitSlotDirective ? elicitSlotDirective.updatedIntent.name : '';
            chai_1.expect(intent).to.equal(currentItem.elicitsForIntent, `The response did not ask Alexa to elicit a slot for the intent ${currentItem.elicitsForIntent}`);
        }
        if (currentItem.confirmsSlot) {
            const confirmSlotDirective = response.response.directives
                ? response.response.directives.find((value) => value.type === 'Dialog.ConfirmSlot')
                : undefined;
            const slot = confirmSlotDirective ? confirmSlotDirective.slotToConfirm : '';
            chai_1.expect(slot).to.equal(currentItem.confirmsSlot, `The response did not ask Alexa to confirm the slot ${currentItem.confirmsSlot}`);
        }
        if (currentItem.confirmsIntent) {
            const confirmIntentDirective = response.response.directives
                ? response.response.directives.find((value) => value.type === 'Dialog.ConfirmIntent')
                : undefined;
            chai_1.expect(confirmIntentDirective, 'The response did not ask Alexa to confirm the intent').not.to.be.undefined;
        }
    }
}
exports.DialogValidator = DialogValidator;
//# sourceMappingURL=DialogValidator.js.map