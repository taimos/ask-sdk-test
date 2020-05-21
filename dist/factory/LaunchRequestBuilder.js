"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaunchRequestBuilder = void 0;
const uuid_1 = require("uuid");
const RequestBuilder_1 = require("./RequestBuilder");
class LaunchRequestBuilder extends RequestBuilder_1.RequestBuilder {
    constructor(settings) {
        super(settings);
    }
    buildRequest() {
        return {
            type: 'LaunchRequest',
            requestId: `EdwRequestId.${uuid_1.v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
        };
    }
}
exports.LaunchRequestBuilder = LaunchRequestBuilder;
//# sourceMappingURL=LaunchRequestBuilder.js.map