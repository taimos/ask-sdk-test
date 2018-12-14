/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {RequestEnvelope, ResponseEnvelope} from 'ask-sdk-model';

export interface SkillSettings {
    appId : string;
    userId : string;
    deviceId : string;
    locale : string;
    interfaces? : InterfaceSettings;
}

export interface InterfaceSettings {
    display? : boolean;
    audio? : boolean;
    video? : boolean;
    apl? : boolean;
}

export interface SequenceItem {
    /** The request to run. Generate these with one of the above `getFooRequest` methods. */
    request : RequestEnvelope;

    /** Receives the response object from the request as a parameter. You can make custom checks against the response using any assertion library you like in here. */
    callback? : (response : ResponseEnvelope) => void;
    /** Tests that the speech output from the request is the string specified. */
    says? : string | string[] | ((speech : string) => boolean);
    /** Tests that the speech output from the request contains the string specified. */
    saysLike? : string;
    /** If true, tests that the response has no speech output. */
    saysNothing? : boolean;
    /** Tests that the reprompt output from the request is the string specified. */
    reprompts? : string | string[] | ((speech : string) => boolean);
    /** Tests that the reprompt output from the request contains the string specified. */
    repromptsLike? : string;
    /** If true, tests that the response has no reprompt output. */
    repromptsNothing? : boolean;
    /** If true, tests that the response to the request ends or does not end the session. */
    shouldEndSession? : boolean;
    /** If true, tests that the response speech contains a question mark when the session is kept open */
    ignoreQuestionCheck? : boolean;

    /** Tests that the response asks Alexa to elicit the given slot. */
    elicitsSlot? : string;
    /** Tests that the response asks Alexa to confirm the given slot. */
    confirmsSlot? : string;
    /** Tests that the response asks Alexa to confirm the intent. */
    confirmsIntent? : boolean;

    /** Tests that the response contains the given attributes and values. Values can be strings, numbers, booleans or functions testing the value. */
    hasAttributes? : { [key : string] : (string | number | boolean | ((attribute : any) => boolean)) };
    /** The session attributes to initialize the an intent request with. */
    withSessionAttributes? : { [key : string] : any };
    /** Tests that the given attributes were stored in the DynamoDB. Values can be strings, numbers, booleans or functions testing the value. */
    storesAttributes? : { [key : string] : (string | number | boolean | ((attribute : any) => boolean)); };
    /** The attributes to initialize the handler with. Used with DynamoDB mock. */
    withStoredAttributes? : { [key : string] : any; };

    /** Tests that the card sent by the response has the title specified. */
    hasCardTitle? : string;
    /** Tests that the card sent by the response is a simple card and has the content specified. */
    hasCardContent? : string;
    /** Tests that the card sent by the response is a simple card and contains the content specified. */
    hasCardContentLike? : string;
    /** Tests that the card sent by the response is a standard card and has the text specified. */
    hasCardText? : string;
    /** Tests that the card sent by the response is a standard card and contains the text specified. */
    hasCardTextLike? : string;
    /** Tests that the card sent by the response is a standard card and has a small image URL containing the string specified. */
    hasSmallImageUrlLike? : string;
    /** Tests that the card sent by the response is a standard card and has a large image URL containing the string specified. */
    hasLargeImageUrlLike? : string;

    /** Tests that the AudioPlayer is used to play a stream. */
    playsStream? : PlayStreamConfig;
    /** Tests that the AudioPlayer is stopped. */
    stopsStream? : boolean;
    /** Tests that the AudioPlayer clears the queue with the given clear behavior. */
    clearsQueue? : string;

    /** Tests that the VideoPlayer is used to play a stream. */
    playsVideo? : PlayVideoConfig;

    /** Any additional fields for custom validators */
    [key : string] : any;
}

export interface PlayStreamConfig {
    behavior? : string;
    token? : string;
    previousToken? : string;
    url? : string;
    offset? : number;
}

export interface PlayVideoConfig {
    source? : string;
    titel? : string;
    subtitle? : string;
}

export abstract class ResponseValidator {

    public abstract validate(currentItem : SequenceItem, response : ResponseEnvelope) : void;

}
