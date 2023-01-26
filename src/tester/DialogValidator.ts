/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { dialog, ResponseEnvelope } from 'ask-sdk-model';
import { expect } from 'chai';
import { ResponseValidator, SequenceItem } from '../types';

export class DialogValidator extends ResponseValidator {

  public validate(currentItem: SequenceItem, response: ResponseEnvelope): void {
    if (currentItem.elicitsSlot) {
      const elicitSlotDirective = response.response.directives
        ? <dialog.ElicitSlotDirective>response.response.directives.find((value) => value.type === 'Dialog.ElicitSlot')
        : undefined;
      const slot = elicitSlotDirective ? elicitSlotDirective.slotToElicit : '';
      expect(slot).to.equal(currentItem.elicitsSlot, `The response did not ask Alexa to elicit the slot ${currentItem.elicitsSlot}`);
    }
    if (currentItem.elicitsForIntent) {
      const elicitSlotDirective = response.response.directives
        ? <dialog.ElicitSlotDirective>response.response.directives.find((value) => value.type === 'Dialog.ElicitSlot')
        : undefined;
      const intent = elicitSlotDirective ? elicitSlotDirective.updatedIntent!.name : '';
      expect(intent).to.equal(currentItem.elicitsForIntent, `The response did not ask Alexa to elicit a slot for the intent ${currentItem.elicitsForIntent}`);
    }

    if (currentItem.confirmsSlot) {
      const confirmSlotDirective = response.response.directives
        ? <dialog.ConfirmSlotDirective>response.response.directives.find((value) => value.type === 'Dialog.ConfirmSlot')
        : undefined;
      const slot = confirmSlotDirective ? confirmSlotDirective.slotToConfirm : '';
      expect(slot).to.equal(currentItem.confirmsSlot, `The response did not ask Alexa to confirm the slot ${currentItem.confirmsSlot}`);
    }

    if (currentItem.confirmsIntent) {
      const confirmIntentDirective = response.response.directives
        ? <dialog.ConfirmIntentDirective>response.response.directives.find((value) => value.type === 'Dialog.ConfirmIntent')
        : undefined;
      expect(confirmIntentDirective, 'The response did not ask Alexa to confirm the intent').not.to.be.undefined;
    }
  }

}
