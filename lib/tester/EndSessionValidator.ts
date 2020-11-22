/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { ResponseEnvelope } from 'ask-sdk-model';
import { fail } from 'assert';
import { ResponseValidator, SequenceItem } from '../types';

export class EndSessionValidator extends ResponseValidator {
    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        // check the shouldEndSession flag
        const expectedShouldEndSession = response.response.shouldEndSession;
        if (currentItem.shouldEndSession === expectedShouldEndSession) {
            return;
        }

        let failMessage = `shouldEndSession was in an unexpected state. Expected: ${currentItem.shouldEndSession}. Actual: ${expectedShouldEndSession}`;
        if (currentItem.shouldEndSession === true && expectedShouldEndSession !== true) {
            failMessage = 'the response did not end the session';
        } else if (currentItem.shouldEndSession === false && expectedShouldEndSession !== false) {
            failMessage = 'the response ended the session';
        } else if (currentItem.shouldEndSession === undefined && expectedShouldEndSession !== undefined) {
            failMessage = 'end of session was not left in an undefined state';
        }
        fail(failMessage);
    }

}
