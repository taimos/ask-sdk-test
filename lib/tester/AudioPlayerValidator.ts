/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {interfaces, ResponseEnvelope} from 'ask-sdk-model';
import {fail} from 'assert';
import {expect} from 'chai';
import {ResponseValidator, SequenceItem} from '../types';

export class AudioPlayerValidator extends ResponseValidator {
    public validate(currentItem : SequenceItem, response : ResponseEnvelope) : void {
        if (currentItem.playsStream) {
            const playDirective = <interfaces.audioplayer.PlayDirective> response.response.directives.find((value) => value.type === 'AudioPlayer.Play');
            if (!playDirective) {
                fail('the response did not play a stream');
            }

            const playConfig = currentItem.playsStream;
            expect(playDirective.playBehavior).to.be.equal(playConfig.behavior, 'playBehavior did not match');

            const stream = playDirective.audioItem.stream;
            if (!stream.url.startsWith('https://')) {
                fail('the stream URL is not https');
            }
            expect(stream.url).to.be.equal(playConfig.url, 'stream URL did not match');

            if (playConfig.token) {
                expect(stream.token).to.be.equal(playConfig.token, 'token did not match');
            }
            if (playConfig.previousToken) {
                expect(stream.expectedPreviousToken).to.be.equal(playConfig.previousToken, 'previous token did not match');
            }
            if (playConfig.offset || playConfig.offset === 0) {
                expect(stream.offsetInMilliseconds).to.be.equal(playConfig.offset, 'stream offset did not match');
            }
        }

        if (currentItem.stopsStream) {
            if (!response.response.directives.find((value) => value.type === 'AudioPlayer.Stop')) {
                fail('the response did not stop the stream');
            }
        }

        if (currentItem.clearsQueue) {
            const clearDirective = <interfaces.audioplayer.ClearQueueDirective> response.response.directives.find((value) => value.type === 'AudioPlayer.ClearQueue');
            if (!clearDirective) {
                fail('the response did not clear the audio queue');
            }
            expect(clearDirective.clearBehavior).to.be.equal(currentItem.clearsQueue, 'clear queue behavior did not match');
        }
    }

}
