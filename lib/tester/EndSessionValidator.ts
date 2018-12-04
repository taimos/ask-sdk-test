/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {ResponseEnvelope} from 'ask-sdk-model';
import {fail} from 'assert';
import {ResponseValidator, SequenceItem} from '../types';

export class EndSessionValidator extends ResponseValidator {
    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        // check the shouldEndSession flag
        if (currentItem.shouldEndSession === true && response.response.shouldEndSession === false) {
            fail('the response did not end the session');
        } else if (currentItem.shouldEndSession === false && response.response.shouldEndSession !== false) {
            fail('the response ended the session');
        }
    }

}
