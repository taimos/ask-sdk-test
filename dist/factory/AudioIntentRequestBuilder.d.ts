import { interfaces, RequestEnvelope } from 'ask-sdk-model';
import { SkillSettings } from '../types';
import { IntentRequestBuilder } from './IntentRequestBuilder';
import PlayerActivity = interfaces.audioplayer.PlayerActivity;
export declare class AudioPlayerResumeIntentRequestBuilder extends IntentRequestBuilder {
    private token;
    private offset;
    private activity;
    constructor(settings: SkillSettings);
    withToken(token: string): AudioPlayerResumeIntentRequestBuilder;
    withOffset(offset: number): AudioPlayerResumeIntentRequestBuilder;
    withCurrentActivity(activity: PlayerActivity): AudioPlayerResumeIntentRequestBuilder;
    protected modifyRequest(request: RequestEnvelope): void;
}
export declare class AudioPlayerPauseIntentRequestBuilder extends IntentRequestBuilder {
    constructor(settings: SkillSettings);
}
