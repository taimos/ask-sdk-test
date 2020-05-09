import { Request, SlotConfirmationStatus, IntentConfirmationStatus } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';
export declare class IntentRequestBuilder extends RequestBuilder {
    private intentName;
    private slots;
    private confirmationStatus;
    constructor(settings: SkillSettings, intentName: string);
    withEmptySlot(name: string): IntentRequestBuilder;
    withSlot(name: string, value: string): IntentRequestBuilder;
    withSlotConfirmation(name: string, value: string, confirmationStatus: SlotConfirmationStatus): IntentRequestBuilder;
    withSlotResolution(name: string, value: string, slotType: string, id: string): IntentRequestBuilder;
    withSlotResolutionNoMatch(name: string, value: string, slotType: string): IntentRequestBuilder;
    withIntentConfirmation(confirmationStatus: IntentConfirmationStatus): IntentRequestBuilder;
    protected buildRequest(): Request;
}
