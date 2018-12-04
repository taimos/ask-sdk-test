/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {ResponseEnvelope} from 'ask-sdk-model';
import {fail} from 'assert';
import {expect} from 'chai';
import {ResponseValidator, SequenceItem} from '../types';

export class SessionAttributeValidator extends ResponseValidator {

    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        if (currentItem.hasAttributes) {
            for (const att in currentItem.hasAttributes) {
                if (currentItem.hasAttributes.hasOwnProperty(att)) {
                    const attr = currentItem.hasAttributes[att];
                    if (typeof attr === 'function') {
                        if (!attr(response.sessionAttributes[att])) {
                            fail(`The attribute ${att} did not contain the correct value. Value was: ${response.sessionAttributes[att]}`);
                        }
                    } else {
                        expect(response.sessionAttributes[att], `Session attribute ${att} failed`).to.deep.equal(attr);
                    }
                }
            }
        }
    }

}
