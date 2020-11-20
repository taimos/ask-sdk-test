import { AlexaTest, LaunchRequestBuilder, SkillSettings } from '../../lib';
import { handler as skillHandler } from './apla';

// initialize the testing framework
const skillSettings: SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('APLA', () => {

    describe('APLA directives', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings)
                    .build(),
                says: 'Check out my APL for Audio!',
                renderDocument: {
                    token: 'LAUNCH_TOKEN',
                    document: (doc: any) => {
                        return doc !== undefined && doc.version === '0.9';
                    },
                    hasDataSources: {
                        payload: (ds: any) => {
                            return ds !== undefined && ds.user.name === 'John';
                        },
                    },
                },
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });
});
