# Alexa Skill Test Framework

[![Build Status](https://travis-ci.org/taimos/ask-sdk-test.svg?branch=master)](https://travis-ci.org/taimos/ask-sdk-test)
![Build Status](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSjBhbVJlQ2NUVWdGRUEwK2d3bmhWdGkzNktiTFpDNnFtWlpuemtweithZ3pTV2JrVjczQXdwMldyR3gvbHpXUndodVlJZzk2aU56N1poUnZZRnJPYUpRPSIsIml2UGFyYW1ldGVyU3BlYyI6InZrOUloOTdMQ3VsRlI0WGEiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
[![npm version](https://badge.fury.io/js/ask-sdk-test.svg)](https://badge.fury.io/js/ask-sdk-test)

This framework makes it easy to create full-coverage black box tests for an Alexa skill using [Mocha](https://mochajs.org/).

Here's an example of what a test might look like with the test framework.

```typescript
import {AlexaTest, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings} from 'ask-sdk-test';
import {handler as skillHandler} from './helloworld';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

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
```

If you are writing your Alexa Skills in Python, check out https://github.com/BananaNosh/py_ask_sdk_test

## How To
Install the package as a dev dependency with `npm install ask-sdk-test --save-dev`.

Write tests in a Typescript file and run them with Mocha. For example, if your test is at 'test/skill.spec.ts', run `mocha --require node_modules/ts-node/register/index.js test/skill.spec.ts`.

For some simple examples, see the 'examples' directory.

## History

This framework is based on the [alexa-skill-test-framework](https://github.com/BrianMacIntosh/alexa-skill-test-framework) by Brian MacIntosh and rewritten for Typescript and the ASK SDK v2.
