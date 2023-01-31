/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { AlexaTest, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings } from '../../src';
import { AudioPlayerPauseIntentRequestBuilder, AudioPlayerResumeIntentRequestBuilder } from '../../src/factory/AudioIntentRequestBuilder';
import { handler as skillHandler } from './audioplayer';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('Audio Player Skill', () => {
    'use strict';

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: 'Hello World!', repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });

    describe('PlayStreamIntent', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'PlayStreamIntent').build(),
                playsStream: {
                    behavior: 'REPLACE_ALL',
                    url: 'https://superAudio.stream',
                    token: 'superToken',
                },
            },
        ]);
    });

    describe('ClearQueueIntent', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'ClearQueueIntent').build(),
                clearsQueue: 'CLEAR_ALL',
            },
        ]);
    });

    describe('AMAZON.ResumeIntent', () => {
        alexaTest.test([
            {
                request: new AudioPlayerResumeIntentRequestBuilder(skillSettings).build(),
                playsStream: {
                    behavior: 'REPLACE_ALL',
                    url: 'https://superAudio.stream',
                    token: 'superToken',
                    offset: 0,
                },
            },
        ]);
    });

    describe('AMAZON.ResumeIntent at position', () => {
        alexaTest.test([
            {
                request: new AudioPlayerResumeIntentRequestBuilder(skillSettings).withToken('superToken').withOffset(123).build(),
                playsStream: {
                    behavior: 'REPLACE_ALL',
                    url: 'https://superAudio.stream',
                    token: 'superToken',
                    offset: 123,
                },
            },
        ]);
    });

    describe('AMAZON.PauseIntent', () => {
        alexaTest.test([
            {
                request: new AudioPlayerPauseIntentRequestBuilder(skillSettings).build(),
                stopsStream: true,
            },
        ]);
    });
});
