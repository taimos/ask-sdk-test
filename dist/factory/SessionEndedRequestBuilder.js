"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const RequestBuilder_1 = require("./RequestBuilder");
class SessionEndedRequestBuilder extends RequestBuilder_1.RequestBuilder {
    constructor(settings, reason) {
        super(settings);
        this.reason = reason;
    }
    buildRequest() {
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
            requestId: `EdwRequestId.${uuid_1.v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            reason: this.reason,
        };
    }
}
exports.SessionEndedRequestBuilder = SessionEndedRequestBuilder;
//# sourceMappingURL=SessionEndedRequestBuilder.js.map