import { Request, SessionEndedReason } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';
export declare class SessionEndedRequestBuilder extends RequestBuilder {
    private reason;
    constructor(settings: SkillSettings, reason: SessionEndedReason);
    protected buildRequest(): Request;
}
