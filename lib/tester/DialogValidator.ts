/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {dialog, ResponseEnvelope} from 'ask-sdk-model';
import {expect} from 'chai';
import {ResponseValidator, SequenceItem} from '../types';

export class DialogValidator extends ResponseValidator {

    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        if (currentItem.elicitsSlot) {
            const elicitSlotDirective = <dialog.ElicitSlotDirective> response.response.directives.find((value) => value.type === 'Dialog.ElicitSlot');
            const slot = elicitSlotDirective ? elicitSlotDirective.slotToElicit : '';
            expect(slot).to.equal(currentItem.elicitsSlot, `The response did not ask Alexa to elicit the slot ${currentItem.elicitsSlot}`);
        }

        if (currentItem.confirmsSlot) {
            const confirmSlotDirective = <dialog.ConfirmSlotDirective> response.response.directives.find((value) => value.type === 'Dialog.ConfirmSlot');
            const slot = confirmSlotDirective ? confirmSlotDirective.slotToConfirm : '';
            expect(slot).to.equal(currentItem.confirmsSlot, `The response did not ask Alexa to confirm the slot ${currentItem.confirmsSlot}`);
        }

        if (currentItem.confirmsIntent) {
            const confirmIntentDirective = <dialog.ConfirmIntentDirective> response.response.directives.find((value) => value.type === 'Dialog.ConfirmIntent');
            expect(confirmIntentDirective, 'The response did not ask Alexa to confirm the intent').not.to.be.undefined;
        }
    }

}
