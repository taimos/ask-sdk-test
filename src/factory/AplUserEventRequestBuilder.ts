/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { interfaces } from 'ask-sdk-model';
import { v4 } from 'uuid';
import { RequestBuilder } from './RequestBuilder';
import { SkillSettings } from '../types';

import UserEvent = interfaces.alexa.presentation.apl.UserEvent;

export class AplUserEventRequestBuilder extends RequestBuilder {
  private token?: string;
  private arguments?: any[];
  private source: any | undefined;
  private components: any | undefined;

  constructor(settings: SkillSettings) {
    super(settings);
  }

  public withToken(token: string): AplUserEventRequestBuilder {
    this.token = token;
    return this;
  }

  public withArguments(...args: any[]): AplUserEventRequestBuilder {
    this.arguments = args;
    return this;
  }

  public withSource(source: any): AplUserEventRequestBuilder {
    this.source = source;
    return this;
  }

  public withComponents(components: string): AplUserEventRequestBuilder {
    this.components = components;
    return this;
  }

  protected buildRequest(): UserEvent {
    return {
      type: 'Alexa.Presentation.APL.UserEvent',
      requestId: `EdwRequestId.${v4()}`,
      timestamp: new Date().toISOString(),
      locale: this.settings.locale,
      token: this.token,
      arguments: this.arguments,
      components: this.components,
      source: this.source,
    };
  }
}
