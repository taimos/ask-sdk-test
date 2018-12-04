/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {HandlerInput, RequestHandler, SkillBuilders} from 'ask-sdk';
import {LambdaHandler} from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import {Response} from 'ask-sdk-model';

class LaunchRequestHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
          || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent');
    }

    public handle(handlerInput : HandlerInput) : Response {
        const speech = ['Hello, how are you?', 'Hi, what\'s up?', 'Good day, how are you doing?'];
        const reprompt = ['How are you?', 'How do you feel?'];
        return handlerInput.responseBuilder
          .speak(speech[Math.floor(Math.random() * speech.length)])
          .reprompt(reprompt[Math.floor(Math.random() * reprompt.length)])
          .getResponse();
    }

}

export const handler : LambdaHandler = SkillBuilders.custom()
  .addRequestHandlers(
    new LaunchRequestHandler(),
  )
  .lambda();
