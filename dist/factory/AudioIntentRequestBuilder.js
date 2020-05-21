"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayerPauseIntentRequestBuilder = exports.AudioPlayerResumeIntentRequestBuilder = void 0;
const IntentRequestBuilder_1 = require("./IntentRequestBuilder");
class AudioPlayerResumeIntentRequestBuilder extends IntentRequestBuilder_1.IntentRequestBuilder {
    constructor(settings) {
        super(settings, 'AMAZON.ResumeIntent');
    }
    withToken(token) {
        this.token = token;
        return this;
    }
    withOffset(offset) {
        this.offset = offset;
        return this;
    }
    withCurrentActivity(activity) {
        this.activity = activity;
        return this;
    }
    modifyRequest(request) {
        super.modifyRequest(request);
        if (!request.context.AudioPlayer) {
            request.context.AudioPlayer = {};
        }
        if (this.token) {
            request.context.AudioPlayer.token = this.token;
        }
        if (this.offset) {
            request.context.AudioPlayer.offsetInMilliseconds = this.offset;
        }
        if (this.activity) {
            request.context.AudioPlayer.playerActivity = this.activity;
        }
    }
}
exports.AudioPlayerResumeIntentRequestBuilder = AudioPlayerResumeIntentRequestBuilder;
class AudioPlayerPauseIntentRequestBuilder extends IntentRequestBuilder_1.IntentRequestBuilder {
    constructor(settings) {
        super(settings, 'AMAZON.PauseIntent');
    }
}
exports.AudioPlayerPauseIntentRequestBuilder = AudioPlayerPauseIntentRequestBuilder;
//# sourceMappingURL=AudioIntentRequestBuilder.js.map