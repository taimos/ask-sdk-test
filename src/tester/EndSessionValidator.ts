/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { fail } from 'assert';
import { ResponseEnvelope } from 'ask-sdk-model';
import { ResponseValidator, SequenceItem } from '../types';

export class EndSessionValidator extends ResponseValidator {
  public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
    // check the shouldEndSession flag
    const actualShouldEndSession = response.response.shouldEndSession;
    if (currentItem.shouldEndSession === actualShouldEndSession) {
      return;
    }

    let failMessage = `shouldEndSession was in an unexpected state. Expected: ${currentItem.shouldEndSession}. Actual: ${actualShouldEndSession}`;
    if (currentItem.shouldEndSession === true && actualShouldEndSession !== true) {
      failMessage = 'the response did not end the session';
    } else if (currentItem.shouldEndSession === false && actualShouldEndSession !== false) {
      failMessage = 'the response ended the session';
    } else if (currentItem.shouldEndSession === undefined && actualShouldEndSession !== undefined) {
      failMessage = 'end of session was not left in an undefined state';
    }
    fail(failMessage);
  }

}
