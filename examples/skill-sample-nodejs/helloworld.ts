/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {HandlerInput, RequestHandler, SkillBuilders} from 'ask-sdk';
import {LambdaHandler} from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import {Response} from 'ask-sdk-model';

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    }

    public handle(handlerInput : HandlerInput) : Response {
        const speechText = 'Welcome to the Alexa Skills Kit, you can say hello!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }

}

class HelloWorldIntentHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    }

    public handle(handlerInput : HandlerInput) : Response {
        const speechText = 'Hello World!';

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.foo = 'bar';
        attributes.count = 1;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
}

export const handler : LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
        new HelloWorldIntentHandler(),
    )
    .lambda();
