/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { Request } from 'ask-sdk-model';
import { v4 } from 'uuid';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';

export class LaunchRequestBuilder extends RequestBuilder {

    constructor(settings : SkillSettings) {
        super(settings);
    }

    protected buildRequest() : Request {
        return {
            type: 'LaunchRequest',
            requestId: `EdwRequestId.${v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
        };
    }

}
