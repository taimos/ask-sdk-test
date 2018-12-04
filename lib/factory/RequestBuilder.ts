/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {Context, Request, RequestEnvelope, Session} from 'ask-sdk-model';
import {v4} from 'uuid';
import {SkillSettings} from '../types';

export abstract class RequestBuilder {

    protected settings : SkillSettings;

    constructor(settings : SkillSettings) {
        this.settings = settings;
    }

    public build() : RequestEnvelope {
        const request : RequestEnvelope = {
            version: '1.0',
            session: this.getSessionData(),
            context: this.getContextData(),
            request: this.buildRequest(),
        };
        this.modifyRequest(request);
        return request;
    }

    protected abstract buildRequest() : Request;

    protected modifyRequest(request : RequestEnvelope) : void {
        // override if needed
    }

    protected getSessionData() : Session {
        return {
            // randomized for every session and set before calling the handler
            sessionId: 'SessionId.00000000-0000-0000-0000-000000000000',
            application: {applicationId: this.settings.appId},
            attributes: {},
            user: {userId: this.settings.userId},
            new: true,
        };
    }

    protected getContextData() : Context {
        return {
            System: {
                application: {applicationId: this.settings.appId},
                user: {userId: this.settings.userId},
                device: {
                    deviceId: this.settings.deviceId,
                    supportedInterfaces: {
                        AudioPlayer: {},
                    },
                },
                apiEndpoint: 'https://api.amazonalexa.com/',
            },
            AudioPlayer: {
                playerActivity: 'IDLE',
            },
        };
    }

}
