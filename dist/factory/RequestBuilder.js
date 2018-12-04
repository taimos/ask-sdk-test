"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RequestBuilder {
    constructor(settings) {
        this.settings = settings;
    }
    build() {
        const request = {
            version: '1.0',
            session: this.getSessionData(),
            context: this.getContextData(),
            request: this.buildRequest(),
        };
        this.modifyRequest(request);
        return request;
    }
    modifyRequest(request) {
        // override if needed
    }
    getSessionData() {
        return {
            // randomized for every session and set before calling the handler
            sessionId: 'SessionId.00000000-0000-0000-0000-000000000000',
            application: { applicationId: this.settings.appId },
            attributes: {},
            user: { userId: this.settings.userId },
            new: true,
        };
    }
    getContextData() {
        return {
            System: {
                application: { applicationId: this.settings.appId },
                user: { userId: this.settings.userId },
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
exports.RequestBuilder = RequestBuilder;
//# sourceMappingURL=RequestBuilder.js.map