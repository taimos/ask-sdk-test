"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoAppValidator = void 0;
const assert_1 = require("assert");
const chai_1 = require("chai");
const types_1 = require("../types");
class VideoAppValidator extends types_1.ResponseValidator {
    validate(currentItem, response) {
        if (currentItem.playsVideo) {
            const directive = response.response.directives.find((value) => value.type === 'VideoApp.Launch');
            if (!directive) {
                assert_1.fail('the response did not play a video');
            }
            const playConfig = currentItem.playsVideo;
            const stream = directive.videoItem.source;
            if (!stream.startsWith('https://')) {
                assert_1.fail('the stream URL is not https');
            }
            chai_1.expect(stream).to.be.equal(playConfig.source, 'video source did not match');
            if (playConfig.titel) {
                chai_1.expect(directive.videoItem.metadata.title).to.be.equal(playConfig.titel, 'title did not match');
            }
            if (playConfig.subtitle) {
                chai_1.expect(directive.videoItem.metadata.subtitle).to.be.equal(playConfig.subtitle, 'subtitle did not match');
            }
        }
    }
}
exports.VideoAppValidator = VideoAppValidator;
//# sourceMappingURL=VideoAppValidator.js.map