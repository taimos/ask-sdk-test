"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBuilder = void 0;
const uuid_1 = require("uuid");
class RequestBuilder {
    constructor(settings) {
        this.settings = JSON.parse(JSON.stringify(settings));
        if (!this.settings.interfaces) {
            this.settings.interfaces = {};
        }
        if (!this.settings.interfaces.hasOwnProperty('audio')) {
            this.settings.interfaces.audio = true;
        }
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
    withInterfaces(iface) {
        if (iface.hasOwnProperty('apl')) {
            this.settings.interfaces.apl = iface.apl;
        }
        if (iface.hasOwnProperty('audio')) {
            this.settings.interfaces.audio = iface.audio;
        }
        if (iface.hasOwnProperty('display')) {
            this.settings.interfaces.display = iface.display;
        }
        if (iface.hasOwnProperty('video')) {
            this.settings.interfaces.video = iface.video;
        }
        return this;
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
        const ctx = {
            System: {
                application: { applicationId: this.settings.appId },
                user: { userId: this.settings.userId },
                device: {
                    deviceId: this.settings.deviceId,
                    supportedInterfaces: {},
                },
                apiEndpoint: 'https://api.amazonalexa.com/',
                apiAccessToken: uuid_1.v4(),
            },
            AudioPlayer: {
                playerActivity: 'IDLE',
            },
        };
        if (this.settings.interfaces.audio) {
            ctx.System.device.supportedInterfaces.AudioPlayer = {};
        }
        if (this.settings.interfaces.display) {
            ctx.System.device.supportedInterfaces.Display = { templateVersion: '1.0', markupVersion: '1.0' };
        }
        if (this.settings.interfaces.video) {
            ctx.System.device.supportedInterfaces.VideoApp = {};
        }
        if (this.settings.interfaces.apl) {
            ctx.System.device.supportedInterfaces['Alexa.Presentation.APL'] = { runtime: { maxVersion: '1.0' } };
        }
        return ctx;
    }
}
exports.RequestBuilder = RequestBuilder;
//# sourceMappingURL=RequestBuilder.js.map