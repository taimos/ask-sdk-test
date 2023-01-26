const { TaimosTypescriptLibrary } = require('@taimos/projen');

const project = new TaimosTypescriptLibrary({
  name: 'ask-sdk-test',
  license: 'MIT',
  deps: [
    'aws-sdk',
    'aws-sdk-mock',
    'lambda-local',
    'uuid',
    'nock',
  ],
  defaultReleaseBranch: 'master',
  devDeps: [
    '@taimos/projen',
    '@types/chai',
    '@types/uuid',
    '@types/mocha',
    '@types/node',
    '@types/sinon',
    'chai',
    'rimraf',
    'mocha',
    'nyc',
    'sinon',
  ],
  peerDeps: [
    'mocha',
    'ask-sdk@^2.10.0',
    'ask-sdk-core@^2.10.1',
    'ask-sdk-model@^1.34.1',
    'chai',
  ],
  keywords: [
    'aws',
    'alexa',
    'amazon',
    'echo',
    'test',
    'offline',
    'mocha',
    'black box',
    'black-box',
    'coverage',
  ],
  jest: false,
  repository: 'https://github.com/taimos/ask-sdk-test',
});

project.addFields({
  resolutions: {
    'ask-sdk-model': '1.34.1',
  },
});

project.testTask.exec("nyc -x tst -e .ts --temp-directory 'coverage/nyc-output' -r html -r text-summary -r cobertura _mocha --require ts-node/register 'test/**/*.spec.ts' 'examples/**/*.spec.ts' --reporter nyan");

project.synth();