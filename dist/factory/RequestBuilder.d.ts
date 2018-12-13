import { Context, Request, RequestEnvelope, Session } from 'ask-sdk-model';
import { InterfaceSettings, SkillSettings } from '../types';
export declare abstract class RequestBuilder {
    protected settings: SkillSettings;
    constructor(settings: SkillSettings);
    build(): RequestEnvelope;
    withInterfaces(iface: InterfaceSettings): RequestBuilder;
    protected abstract buildRequest(): Request;
    protected modifyRequest(request: RequestEnvelope): void;
    protected getSessionData(): Session;
    protected getContextData(): Context;
}
