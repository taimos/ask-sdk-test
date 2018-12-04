/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {Request, SessionEndedReason} from 'ask-sdk-model';
import {v4} from 'uuid';
import {SkillSettings} from '../types';
import {RequestBuilder} from './RequestBuilder';

export class SessionEndedRequestBuilder extends RequestBuilder {

    private reason : SessionEndedReason;

    constructor(settings : SkillSettings, reason : SessionEndedReason) {
        super(settings);
        this.reason = reason;
    }

    protected buildRequest() : Request {
        /*
        {
			"version": this.version,
			"session": this._getSessionData(),
			"context": this._getContextData(),
			"request": {
				"type": "SessionEndedRequest",
				"requestId": "EdwRequestId." + uuid.v4(),
				"timestamp": new Date().toISOString(),
				"locale": locale || this.locale,
				"reason": reason
				//TODO: support error
			}
		}
         */

        return {
            type: 'SessionEndedRequest',
            requestId: `EdwRequestId.${v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            reason: this.reason,
        };
    }

}
