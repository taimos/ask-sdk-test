/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { AlexaTest, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings } from '../../src';
import { handler as skillHandler } from './helloworld';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('Hello World Skill with MultiStrings', () => {
    // tests the behavior of the skill's LaunchRequest
    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: ['Hello, how are you?', 'Hi, what\'s up?', 'Good day, how are you doing?'],
                reprompts: ['How are you?', 'How do you feel?'],
                shouldEndSession: false,
            },
        ]);
    });

    // tests the behavior of the skill's HelloWorldIntent
    describe('HelloWorldIntent', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'HelloWorldIntent').build(),
                says: ['Hello, how are you?', 'Hi, what\'s up?', 'Good day, how are you doing?'],
                reprompts: ['How are you?', 'How do you feel?'],
                shouldEndSession: false,
            },
        ]);
    });
});
