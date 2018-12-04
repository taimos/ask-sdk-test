import { Context, Request, RequestEnvelope, Session } from 'ask-sdk-model';
import { SkillSettings } from '../types';
export declare abstract class RequestBuilder {
    protected settings: SkillSettings;
    constructor(settings: SkillSettings);
    build(): RequestEnvelope;
    protected abstract buildRequest(): Request;
    protected modifyRequest(request: RequestEnvelope): void;
    protected getSessionData(): Session;
    protected getContextData(): Context;
}
