/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { interfaces, RequestEnvelope } from 'ask-sdk-model';
import { IntentRequestBuilder } from './IntentRequestBuilder';
import { SkillSettings } from '../types';
import PlayerActivity = interfaces.audioplayer.PlayerActivity;

export class AudioPlayerResumeIntentRequestBuilder extends IntentRequestBuilder {
  private token?: string;
  private offset?: number;
  private activity?: interfaces.audioplayer.PlayerActivity;

  constructor(settings: SkillSettings) {
    super(settings, 'AMAZON.ResumeIntent');
  }

  public withToken(token: string): AudioPlayerResumeIntentRequestBuilder {
    this.token = token;
    return this;
  }

  public withOffset(offset: number): AudioPlayerResumeIntentRequestBuilder {
    this.offset = offset;
    return this;
  }

  public withCurrentActivity(activity: PlayerActivity): AudioPlayerResumeIntentRequestBuilder {
    this.activity = activity;
    return this;
  }

  protected modifyRequest(request: RequestEnvelope): void {
    super.modifyRequest(request);
    if (!request.context.AudioPlayer) {
      request.context.AudioPlayer = {};
    }
    if (this.token) {
      request.context.AudioPlayer.token = this.token;
    }
    if (this.offset) {
      request.context.AudioPlayer.offsetInMilliseconds = this.offset;
    }
    if (this.activity) {
      request.context.AudioPlayer.playerActivity = this.activity;
    }
  }

}

export class AudioPlayerPauseIntentRequestBuilder extends IntentRequestBuilder {

  constructor(settings: SkillSettings) {
    super(settings, 'AMAZON.PauseIntent');
  }
}
