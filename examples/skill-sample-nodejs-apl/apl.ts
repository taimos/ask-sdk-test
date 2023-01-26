/* tslint:disable: no-invalid-template-strings */

import { DefaultApiClient, HandlerInput, RequestHandler, SkillBuilders } from 'ask-sdk';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { interfaces, Response } from 'ask-sdk-model';
import RenderDocumentDirective = interfaces.alexa.presentation.apl.RenderDocumentDirective;

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {
        const device = handlerInput.requestEnvelope.context.System.device!;
        if (device.supportedInterfaces['Alexa.Presentation.APL'] !== undefined) {
            const token = 'LAUNCH_TOKEN';
            const directive = this.getRenderDirective(token);
            return handlerInput.responseBuilder
                .speak('Check out my APL!')
                .addDirective(directive)
                .withShouldEndSession(true)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak('I do not support APL')
                .withShouldEndSession(true)
                .getResponse();
        }
    }

    private getRenderDirective(token: string): RenderDocumentDirective {
        // Return an Alexa Test List Layout
        // See: https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-alexa-text-list-layout.html
        return {
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: this.getTemplate(),
            token,
            datasources: {
                textListData: this.getListData(),
            },
        };
    }

    private getTemplate(): any {
        return {
            type: 'APL',
            version: '1.3',
            import: [
                {
                    name: 'alexa-layouts',
                    version: '1.1.0',
                },
            ],
            mainTemplate: {
                parameters: [
                    'textListData',
                ],
                items: [
                    {
                        type: 'AlexaTextList',
                        theme: '${viewport.theme}',
                        headerTitle: '${textListData.headerTitle}',
                        headerSubtitle: '${textListData.headerSubtitle}',
                        headerAttributionImage: '${textListData.headerAttributionImage}',
                        headerDivider: true,
                        headerBackButton: false,
                        headerBackButtonAccessibilityLabel: 'back',
                        headerBackgroundColor: 'transparent',
                        touchForward: true,
                        backgroundColor: 'transparent',
                        hideOrdinal: false,
                        backgroundImageSource: '${textListData.backgroundImageSource}',
                        backgroundScale: 'best-fill',
                        backgroundAlign: 'center',
                        backgroundBlur: false,
                        primaryAction: {
                            type: 'SendEvent',
                            arguments: [
                                'ListItemSelected',
                                '${ordinal}',
                            ],
                        },
                        listItems: '${textListData.listItemsToShow}',
                    },
                ],
            },
        };
    }

    private getListData(): any {
        return {
            headerTitle: 'Alexa text list header title',
            headerSubtitle: 'Header subtitle',
            headerAttributionImage: 'https://s3.amazonaws.com/ask-skills-assets/apl-layout-assets/attribution_dark_hub_prime.png',
            backgroundImageSource: 'https://d2o906d8ln7ui1.cloudfront.net/images/BT6_Background.png',
            listItemsToShow: [
                {
                    primaryText: 'First item in the list.',
                },
                {
                    primaryText: 'Second item in the list.',
                },
                {
                    primaryText: 'Third item in the list.',
                },
                {
                    primaryText: 'Fourth item in the list',
                },
                {
                    primaryText: 'Fifth item in the list',
                },
                {
                    primaryText: 'This list might have many more items',
                },
            ],
        };
    }

}

class TouchHandler implements RequestHandler {

    public canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {
        if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent' &&
            handlerInput.requestEnvelope.request.arguments !== undefined) {
            if (handlerInput.requestEnvelope.request.arguments[0] === 'ListItemSelected') {
                const arg = handlerInput.requestEnvelope.request.arguments[1];
                return handlerInput.responseBuilder.speak(`Got launch list item ${arg}`)
                    .getResponse();
            }
        }

        return handlerInput.responseBuilder.speak('Touch arg not handled').withShouldEndSession(true).getResponse();
    }
}

export const handler: LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
        new TouchHandler(),
    )
    .withApiClient(new DefaultApiClient())
    .lambda();
