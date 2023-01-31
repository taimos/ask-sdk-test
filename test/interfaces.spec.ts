/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import { expect } from 'chai';
import { LaunchRequestBuilder, SkillSettings } from '../src';

// initialize the testing framework
const skillSettings: SkillSettings = {
  appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  userId: 'amzn1.ask.account.VOID',
  deviceId: 'amzn1.ask.device.VOID',
  locale: 'en-US',
};

describe('Tests for request builder with interfaces', () => {

  it('should have AudioPlayer by default', () => {
    const request = new LaunchRequestBuilder(skillSettings).build();
    expect(request.context.System.device!.supportedInterfaces).to.have.property('AudioPlayer');
  });

  it('should not have AudioPlayer when disabled', () => {
    const request = new LaunchRequestBuilder(skillSettings).withInterfaces({ audio: false }).build();
    expect(request.context.System.device!.supportedInterfaces).to.not.have.property('AudioPlayer');
  });

  it('should have Display when activated', () => {
    const request = new LaunchRequestBuilder(skillSettings).withInterfaces({ display: true }).build();
    expect(request.context.System.device!.supportedInterfaces).to.have.property('AudioPlayer');
    expect(request.context.System.device!.supportedInterfaces).to.have.property('Display');
  });

});
