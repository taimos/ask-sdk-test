/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { Request, Slot } from 'ask-sdk-model';
import { v4 } from 'uuid';
import { SkillSettings } from '../types';
import { RequestBuilder } from './RequestBuilder';

export class IntentRequestBuilder extends RequestBuilder {

    private intentName : string;
    private slots : { [key : string] : Slot; };

    constructor(settings : SkillSettings, intentName : string) {
        super(settings);
        this.intentName = intentName;
    }

    public withEmptySlot(name : string) : IntentRequestBuilder {
        if (!this.slots) {
            this.slots = {};
        }
        this.slots[name] = {name, value: undefined, confirmationStatus: 'NONE'};
        return this;
    }

    public withSlot(name : string, value : string) : IntentRequestBuilder {
        if (!this.slots) {
            this.slots = {};
        }
        if (!this.slots[name]) {
            this.slots[name] = {name, value, confirmationStatus: 'NONE'};
        } else {
            this.slots[name].value = value;
        }
        return this;
    }

    public withSlotResolution(name : string, value : string, slotType : string, id : string) : IntentRequestBuilder {
        this.withSlot(name, value);

        const authority = `amzn1.er-authority.echo-sdk.${this.settings.appId}.${slotType}`;
        let valueAdded = false;
        if (this.slots[name].resolutions) {
            this.slots[name].resolutions.resolutionsPerAuthority.forEach((rpa) => {
                if (!valueAdded && (rpa.authority === authority)) {
                    rpa.values.push({value: {name: value, id}});
                    valueAdded = true;
                }
            });
        } else {
            this.slots[name].resolutions = {
                resolutionsPerAuthority: [],
            };
        }
        if (!valueAdded) {
            this.slots[name].resolutions.resolutionsPerAuthority.push({
                authority,
                status: {code: 'ER_SUCCESS_MATCH'},
                values: [{value: {name: value, id}}],
            });
        }
        return this;
    }

    public withSlotResolutionNoMatch(name : string, value : string, slotType : string) : IntentRequestBuilder {
        this.withSlot(name, value);

        if (!this.slots[name].resolutions) {
            this.slots[name].resolutions = {
                resolutionsPerAuthority: [],
            };
        }
        this.slots[name].resolutions.resolutionsPerAuthority.push({
            authority: `amzn1.er-authority.echo-sdk.${this.settings.appId}.${slotType}`,
            status: {code: 'ER_SUCCESS_NO_MATCH'},
            values: [],
        });
        return this;
    }

    protected buildRequest() : Request {
        return {
            type: 'IntentRequest',
            requestId: `EdwRequestId.${v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            intent: {
                name: this.intentName,
                slots: this.slots,
                confirmationStatus: 'NONE',
            },
            dialogState: undefined,
        };
    }

}
