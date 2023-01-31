/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { AlexaTest, LaunchRequestBuilder, SkillSettings } from '../../src';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.a5cbce33-2287-40ad-a408-d8ccccb4c794',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
    debug: true,
};

// Using Lambda function name
// const alexaTest = new AlexaTest('lambda:pse-skill-SkillFunction-4EYL1F63JXV', skillSettings);

// Using Logical function name from CloudFormation
const alexaTest = new AlexaTest('cfn:pse-skill:SkillFunction', skillSettings);

describe('Hello World Skill', () => {
    // tests the behavior of the skill's LaunchRequest
    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: "Willkommen bei Taimos P.S.E.! <break time='2s'/> Wie kann ich helfen?",
                shouldEndSession: false,
            },
        ]);
    });
});
