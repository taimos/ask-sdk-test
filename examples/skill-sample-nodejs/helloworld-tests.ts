/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { AlexaTest, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings } from '../../lib';
import { handler as skillHandler } from './helloworld';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('Hello World Skill', () => {
    // tests the behavior of the skill's LaunchRequest
    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: 'Welcome to the Alexa Skills Kit, you can say hello!',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });

    // tests the behavior of the skill's HelloWorldIntent
    describe('HelloWorldIntent', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'HelloWorldIntent').build(),
                says: 'Hello World!', repromptsNothing: true, shouldEndSession: true,
                withSessionAttributes: {
                    bar: true,
                },
                hasAttributes: {
                    foo: 'bar',
                    count: 1,
                    bar: true,
                },
            },
        ]);
    });

    // tests the behavior of the skill's HelloWorldIntent with like operator
    describe('HelloWorldIntent like', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'HelloWorldIntent').build(),
                saysLike: 'World', repromptsNothing: true, shouldEndSession: true,
            },
        ]);
    });
});
