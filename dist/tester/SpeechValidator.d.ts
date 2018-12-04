import { ResponseEnvelope } from 'ask-sdk-model';
import { ResponseValidator, SequenceItem } from '../types';
export declare class SpeechValidator extends ResponseValidator {
    validate(currentItem: SequenceItem, response: ResponseEnvelope): void;
}
