/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {DefaultApiClient, HandlerInput, RequestHandler, SkillBuilders} from 'ask-sdk';
import {LambdaHandler} from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import {Response} from 'ask-sdk-model';

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }

    public async handle(handlerInput : HandlerInput) : Promise<Response> {
        const upsServiceClient = handlerInput.serviceClientFactory.getUpsServiceClient();

        try {
            const name = await upsServiceClient.getProfileName();
            const givenName = await upsServiceClient.getProfileGivenName();
            const email = await upsServiceClient.getProfileEmail();
            const mobile = await upsServiceClient.getProfileMobileNumber();

            const speechText = `Hello, ${givenName} ${name}. Your e-mail is ${email} and your phone number is ${mobile}`;
            return handlerInput.responseBuilder.speak(speechText).getResponse();
        } catch (e) {
            return handlerInput.responseBuilder.speak('Hello, world! I am not allowed to view your profile.').getResponse();
        }
    }

}

export const handler : LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
    )
    .withApiClient(new DefaultApiClient())
    .lambda();
