"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const RequestBuilder_1 = require("./RequestBuilder");
class IntentRequestBuilder extends RequestBuilder_1.RequestBuilder {
    constructor(settings, intentName) {
        super(settings);
        this.intentName = intentName;
        this.confirmationStatus = 'NONE';
    }
    withEmptySlot(name) {
        return this.withSlotConfirmation(name, 'NONE');
    }
    withSlot(name, value) {
        return this.withSlotConfirmation(name, 'NONE', value);
    }
    withSlotConfirmation(name, confirmationStatus, value) {
        if (!this.slots) {
            this.slots = {};
        }
        if (!this.slots[name]) {
            this.slots[name] = { name, value, confirmationStatus };
        }
        else {
            this.slots[name].confirmationStatus = confirmationStatus;
            this.slots[name].value = value;
        }
        return this;
    }
    withSlotResolution(name, value, slotType, id) {
        this.withSlot(name, value);
        const authority = `amzn1.er-authority.echo-sdk.${this.settings.appId}.${slotType}`;
        let valueAdded = false;
        if (this.slots[name].resolutions) {
            this.slots[name].resolutions.resolutionsPerAuthority.forEach((rpa) => {
                if (!valueAdded && (rpa.authority === authority)) {
                    rpa.values.push({ value: { name: value, id } });
                    valueAdded = true;
                }
            });
        }
        else {
            this.slots[name].resolutions = {
                resolutionsPerAuthority: [],
            };
        }
        if (!valueAdded) {
            this.slots[name].resolutions.resolutionsPerAuthority.push({
                authority,
                status: { code: 'ER_SUCCESS_MATCH' },
                values: [{ value: { name: value, id } }],
            });
        }
        return this;
    }
    withSlotResolutionNoMatch(name, value, slotType) {
        this.withSlot(name, value);
        if (!this.slots[name].resolutions) {
            this.slots[name].resolutions = {
                resolutionsPerAuthority: [],
            };
        }
        this.slots[name].resolutions.resolutionsPerAuthority.push({
            authority: `amzn1.er-authority.echo-sdk.${this.settings.appId}.${slotType}`,
            status: { code: 'ER_SUCCESS_NO_MATCH' },
            values: [],
        });
        return this;
    }
    withIntentConfirmation(confirmationStatus) {
        this.confirmationStatus = confirmationStatus;
        return this;
    }
    buildRequest() {
        return {
            type: 'IntentRequest',
            requestId: `EdwRequestId.${uuid_1.v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            intent: {
                name: this.intentName,
                slots: this.slots,
                confirmationStatus: this.confirmationStatus,
            },
            dialogState: undefined,
        };
    }
}
exports.IntentRequestBuilder = IntentRequestBuilder;
//# sourceMappingURL=IntentRequestBuilder.js.map