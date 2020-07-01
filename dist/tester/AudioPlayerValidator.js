"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayerValidator = void 0;
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class AudioPlayerValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        if (currentItem.playsStream) {
            if (!response.response.directives) {
                assert_1.fail('the response did not contain any directives');
            }
            const playDirective = response.response.directives.find((value) => value.type === 'AudioPlayer.Play');
            if (!playDirective) {
                assert_1.fail('the response did not play a stream');
            }
            const playConfig = currentItem.playsStream;
            chai_1.expect(playDirective.playBehavior).to.be.equal(playConfig.behavior, 'playBehavior did not match');
            const stream = playDirective.audioItem.stream;
            if (!stream.url.startsWith('https://')) {
                assert_1.fail('the stream URL is not https');
            }
            chai_1.expect(stream.url).to.be.equal(playConfig.url, 'stream URL did not match');
            if (playConfig.token) {
                chai_1.expect(stream.token).to.be.equal(playConfig.token, 'token did not match');
            }
            if (playConfig.previousToken) {
                chai_1.expect(stream.expectedPreviousToken).to.be.equal(playConfig.previousToken, 'previous token did not match');
            }
            if (playConfig.offset || playConfig.offset === 0) {
                chai_1.expect(stream.offsetInMilliseconds).to.be.equal(playConfig.offset, 'stream offset did not match');
            }
        }
        if (currentItem.stopsStream) {
            if (!response.response.directives || !response.response.directives.find((value) => value.type === 'AudioPlayer.Stop')) {
                assert_1.fail('the response did not stop the stream');
            }
        }
        if (currentItem.clearsQueue) {
            if (!response.response.directives) {
                assert_1.fail('the response did not contain any directives');
            }
            const clearDirective = response.response.directives.find((value) => value.type === 'AudioPlayer.ClearQueue');
            if (!clearDirective) {
                assert_1.fail('the response did not clear the audio queue');
            }
            chai_1.expect(clearDirective.clearBehavior).to.be.equal(currentItem.clearsQueue, 'clear queue behavior did not match');
        }
    }
}
exports.AudioPlayerValidator = AudioPlayerValidator;
//# sourceMappingURL=AudioPlayerValidator.js.map