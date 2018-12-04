/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {DefaultApiClient, DynamoDbPersistenceAdapter, HandlerInput, PersistenceAdapter, RequestHandler, SkillBuilders} from 'ask-sdk';
import {LambdaHandler} from 'ask-sdk-core/dist/skill/factory/BaseSkillFactory';
import {Response} from 'ask-sdk-model';

class SayHelloHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
          (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent') ||
          (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'SayHello');
    }

    public async handle(handlerInput : HandlerInput) : Promise<Response> {
        const attributes = await handlerInput.attributesManager.getPersistentAttributes();
        attributes.foo = 'bar';
        handlerInput.attributesManager.setPersistentAttributes(attributes);
        await handlerInput.attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder.speak('Hello World!').getResponse();
    }
}

class SayGoodbyeHandler implements RequestHandler {

    public canHandle(handlerInput : HandlerInput) : boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'SayGoodbye';
    }

    public async handle(handlerInput : HandlerInput) : Promise<Response> {
        const attributes = await handlerInput.attributesManager.getPersistentAttributes();
        return handlerInput.responseBuilder.speak(`Bye ${attributes.foo}!`).getResponse();
    }
}

export const handler : LambdaHandler = SkillBuilders.custom()
  .withPersistenceAdapter(new DynamoDbPersistenceAdapter({
      tableName: 'TestTable',
      partitionKeyName: 'userId',
      attributesName: 'mapAttr',
  }))
  .withApiClient(new DefaultApiClient())
  .addRequestHandlers(
    new SayHelloHandler(),
    new SayGoodbyeHandler(),
  )
  .lambda();
