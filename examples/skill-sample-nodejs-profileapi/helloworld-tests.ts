/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {AlexaTest, LaunchRequestBuilder, SkillSettings} from '../../lib';
import {handler as skillHandler} from './helloworld';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('Hello World Skill Profile API', () => {

    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                withProfile: {
                    givenName: 'John',
                    name: 'Smith',
                    email: 'john@smith.com',
                    mobileNumber: '+1234567890',
                },
                says: 'Hello, John Smith. Your e-mail is john@smith.com and your phone number is +1234567890',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });

    describe('LaunchRequest without profile info', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: 'Hello, world! I am not allowed to view your profile.',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });

});
