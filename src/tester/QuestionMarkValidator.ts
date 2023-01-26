/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { fail } from 'assert';
import { ResponseEnvelope } from 'ask-sdk-model';
import { ResponseValidator, SequenceItem } from '../types';

export class QuestionMarkValidator extends ResponseValidator {

  public validate(currentItem: SequenceItem, response: ResponseEnvelope): void {
    let actualSay: string;
    if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'SSML') {
      actualSay = response.response.outputSpeech.ssml.substring(7);
      actualSay = actualSay.substring(0, actualSay.length - 8).trim();
    } else if (response.response && response.response.outputSpeech && response.response.outputSpeech.type === 'PlainText') {
      actualSay = response.response.outputSpeech.text;
    } else {
      actualSay = '';
    }

    let hasQuestionMark = false;
    for (let i = 0; actualSay && i < actualSay.length; i++) {
      const c = actualSay[i];
      if (c === '?' || c === '\u055E' || c === '\u061F' || c === '\u2E2E' || c === '\uFF1F') {
        hasQuestionMark = true;
        break;
      }
    }
    if (!currentItem.ignoreQuestionCheck && response.response.shouldEndSession !== false && hasQuestionMark) {
      fail('Possible Certification Problem: The response ends the session but contains a question mark.');
    }
    if (!currentItem.ignoreQuestionCheck && response.response.shouldEndSession === false && !hasQuestionMark) {
      fail('Possible Certification Problem: The response keeps the session open but does not contain a question mark.');
    }
  }

}
