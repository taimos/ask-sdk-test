"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const RequestBuilder_1 = require("./RequestBuilder");
class AplUserEventRequestBuilder extends RequestBuilder_1.RequestBuilder {
    constructor(settings) {
        super(settings);
    }
    withToken(token) {
        this.token = token;
        return this;
    }
    withArguments(...args) {
        this.arguments = args;
        return this;
    }
    withSource(source) {
        this.source = source;
        return this;
    }
    withComponents(components) {
        this.components = components;
        return this;
    }
    buildRequest() {
        return {
            type: 'Alexa.Presentation.APL.UserEvent',
            requestId: `EdwRequestId.${uuid_1.v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            token: this.token,
            arguments: this.arguments,
            components: this.components,
            source: this.source,
        };
    }
}
exports.AplUserEventRequestBuilder = AplUserEventRequestBuilder;
//# sourceMappingURL=AplUserEventRequestBuilder.js.map