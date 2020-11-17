const execa = require('execa');
const { join } = require('path');

const fileExtensionMap = require('../../src/utils/constants');

const CLI_PATH = join(__dirname, '..', '..', 'bin');

// Create config.json for testing purpose
const createUserConfig = (trackName, keysCount) => {
  const userConfig = {
    learningTrack: '',
    userName: 'testConfig',
    taskCount: 0,
    keys: [],
    userSubmittedFiles: [],
  };
  userConfig['learningTrack'] = trackName;

  // Early return to access the defaults
  if (keysCount === 0) {
    return userConfig;
  }

  const filesCount = keysCount === 30 ? 30 : keysCount - 1;

  for (let i = 0; i < keysCount; i++) {
    userConfig['keys'].push(`testKey${i + 1}`);
  }
  for (let i = 0; i < filesCount; i++) {
    userConfig['userSubmittedFiles'].push(
      `task${i + 1}.${fileExtensionMap[trackName]}`,
    );
  }
  userConfig['taskCount'] = filesCount;

  return userConfig;
};

const run = (args, options) => execa('node', [CLI_PATH].concat(args), options);

module.exports = {
  createUserConfig,
  run,
};
