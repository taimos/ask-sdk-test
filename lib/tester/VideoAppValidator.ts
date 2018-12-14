/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {interfaces, ResponseEnvelope} from 'ask-sdk-model';
import {fail} from 'assert';
import {expect} from 'chai';
import {ResponseValidator, SequenceItem} from '../types';

export class VideoAppValidator extends ResponseValidator {
    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        if (currentItem.playsVideo) {
            const directive = <interfaces.videoapp.LaunchDirective> response.response.directives.find((value) => value.type === 'VideoApp.Launch');
            if (!directive) {
                fail('the response did not play a video');
            }

            const playConfig = currentItem.playsVideo;

            const stream = directive.videoItem.source;
            if (!stream.startsWith('https://')) {
                fail('the stream URL is not https');
            }
            expect(stream).to.be.equal(playConfig.source, 'video source did not match');

            if (playConfig.titel) {
                expect(directive.videoItem.metadata.title).to.be.equal(playConfig.titel, 'title did not match');
            }
            if (playConfig.subtitle) {
                expect(directive.videoItem.metadata.subtitle).to.be.equal(playConfig.subtitle, 'subtitle did not match');
            }
        }
    }

}
