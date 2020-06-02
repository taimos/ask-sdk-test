import { interfaces } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';
import UserEvent = interfaces.alexa.presentation.apl.UserEvent;
export declare class AplUserEventRequestBuilder extends RequestBuilder {
    private token;
    private arguments;
    private source;
    private components;
    constructor(settings: SkillSettings);
    withToken(token: string): AplUserEventRequestBuilder;
    withArguments(...args: any[]): AplUserEventRequestBuilder;
    withSource(source: any): AplUserEventRequestBuilder;
    withComponents(components: string): AplUserEventRequestBuilder;
    protected buildRequest(): UserEvent;
}
