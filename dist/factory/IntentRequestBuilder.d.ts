import { Request } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';
export declare class IntentRequestBuilder extends RequestBuilder {
    private intentName;
    private slots;
    constructor(settings: SkillSettings, intentName: string);
    withEmptySlot(name: string): IntentRequestBuilder;
    withSlot(name: string, value: string): IntentRequestBuilder;
    withSlotResolution(name: string, value: string, slotType: string, id: string): IntentRequestBuilder;
    withSlotResultionNoMatch(name: string, value: string, slotType: string): IntentRequestBuilder;
    protected buildRequest(): Request;
}
