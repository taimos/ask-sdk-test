import {AlexaTest, IntentRequestBuilder, LaunchRequestBuilder, SkillSettings} from '../../lib';
import {handler as skillHandler} from './helloworld';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};
const alexaTest = new AlexaTest(skillHandler, skillSettings).withDynamoDBPersistence('TestTable', 'userId', 'mapAttr');

describe('Hello World Skill DynamoDB', () => {
    // tests the behavior of the skill's LaunchRequest
    describe('LaunchRequest', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings).build(),
                says: 'Hello World!',
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
                storesAttributes: {
                    foo: 'bar',
                },
            },
        ]);
    });

    // tests the behavior of the skill's HelloWorldIntent using validation function
    describe('HelloWorldIntent', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'HelloWorldIntent').build(),
                says: 'Hello World!', repromptsNothing: true, shouldEndSession: true,
                storesAttributes: {
                    foo: (value) => {
                        return value === 'bar';
                    },
                },
            },
        ]);
    });

    // tests the behavior of the skill's HelloWorldIntent using validation function
    describe('SayGoodbye', () => {
        alexaTest.test([
            {
                request: new IntentRequestBuilder(skillSettings, 'SayGoodbye').build(),
                says: 'Bye bar!', shouldEndSession: true,
                withStoredAttributes: {
                    foo: 'bar',
                },
            },
        ]);
    });

});
