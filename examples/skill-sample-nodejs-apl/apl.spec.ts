/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { AlexaTest, AplUserEventRequestBuilder, LaunchRequestBuilder, SkillSettings } from '../../lib';
import { handler as skillHandler } from './apl';

// initialize the testing framework
const skillSettings : SkillSettings = {
    appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
};

const alexaTest = new AlexaTest(skillHandler, skillSettings);

describe('APL Presentation', () => {

    // TODO: Pass device Alexa.Presentation.APL
    // TODO: Pass touch event
    // TODO: Check user event

    describe('APL disabled', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings)
                    .withInterfaces({ apl: false })
                    .build(),
                says: 'I do not support APL',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });

    describe('APL with touch', () => {
        alexaTest.test([
            {
                request: new LaunchRequestBuilder(skillSettings)
                    .withInterfaces({ apl: true })
                    .build(),
                says: 'Check out my APL!',
                renderDocument: {
                    token: 'LAUNCH_TOKEN',
                    document: (doc : any) => {
                        return doc !== undefined && doc.version === '1.3';
                    },
                    hasDataSources: {
                        textListData: (ds : any) => {
                            return ds !== undefined && ds.headerTitle === 'Alexa text list header title';
                        },
                    },
                },
                repromptsNothing: true,
                shouldEndSession: true,
            },
            {
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withToken('LAUNCH_TOKEN')
                    .withArguments('ListItemSelected', 1)
                    .withSource({
                        type: 'TouchWrapper',
                        handler: 'Press',
                        id: '',
                    })
                    .build(),
                says: 'Got launch list item 1',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });

    describe('APL touch not handled', () => {
        alexaTest.test([
            {
                request: new AplUserEventRequestBuilder(skillSettings)
                    .withArguments('goBack')
                    .build(),
                says: 'Touch arg not handled',
                repromptsNothing: true,
                shouldEndSession: true,
            },
        ]);
    });
});
