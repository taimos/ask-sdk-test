/* tslint:disable: no-invalid-template-strings */

import { DefaultApiClient, HandlerInput, RequestHandler, SkillBuilders } from 'ask-sdk';
import { LambdaHandler } from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import { interfaces, Response } from 'ask-sdk-model';
import RenderDocumentDirective = interfaces.alexa.presentation.apla.RenderDocumentDirective;

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {
        const token = 'LAUNCH_TOKEN';
        const directive = this.getRenderDirective(token);
        return handlerInput.responseBuilder
            .speak('Check out my APL for Audio!')
            .addDirective(directive)
            .withShouldEndSession(true)
            .getResponse();
    }

    private getRenderDirective(token: string): RenderDocumentDirective {
        // Return an APLA docuemnt
        // See: https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apla-interface.html#renderdocument-directive
        return {
            type: 'Alexa.Presentation.APLA.RenderDocument',
            document: this.getTemplate(),
            token,
            datasources: {
                payload: this.getPayload(),
            },
        };
    }

    private getTemplate(): any {
        return {
            version: "0.9",
            type: "APLA",
            mainTemplate: {
                parameters: [
                    "payload"
                ],
                item: {
                    type: "Selector",
                    items: [
                        {
                            type: "Speech",
                            when: "${payload.user.name == ''}",
                            content: "Hello!"
                        },
                        {
                            type: "Speech",
                            content: "Hi ${payload.user.name}!"
                        }
                    ]
                }
            }
        };
    }

    private getPayload(): any {
        return {
            user: {
                name: "John"
            }
        };
    }

}

export const handler: LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
    )
    .withApiClient(new DefaultApiClient())
    .lambda();
