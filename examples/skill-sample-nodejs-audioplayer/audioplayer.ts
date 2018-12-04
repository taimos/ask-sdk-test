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
        return handlerInput.responseBuilder.speak('Hello World!').getResponse();
    }

}

class PlayStreamIntentHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PlayStreamIntent';
    }

    public handle(handlerInput : HandlerInput) : Response {
        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', 'https://superAudio.stream', 'superToken', 0, null)
            .getResponse();
    }
}

class ClearQueueIntentHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ClearQueueIntent';
    }

    public handle(handlerInput : HandlerInput) : Response {
        return handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .getResponse();
    }
}

class StopAudioHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
    }

    public handle(handlerInput : HandlerInput) : Response {
        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
    }
}

class ResumeIntentHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent';
    }

    public handle(handlerInput : HandlerInput) : Response {
        const offset = handlerInput.requestEnvelope.context.AudioPlayer ? handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds || 0 : 0;
        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', 'https://superAudio.stream', 'superToken', offset, 'superToken')
            .getResponse();
    }
}

export const handler : LambdaHandler = SkillBuilders.custom()
    .addRequestHandlers(
        new LaunchRequestHandler(),
        new PlayStreamIntentHandler(),
        new ClearQueueIntentHandler(),
        new StopAudioHandler(),
        new ResumeIntentHandler(),
    )
    .lambda();
