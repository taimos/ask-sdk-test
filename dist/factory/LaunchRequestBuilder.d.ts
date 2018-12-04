import { Request } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';
export declare class LaunchRequestBuilder extends RequestBuilder {
    constructor(settings: SkillSettings);
    protected buildRequest(): Request;
}
