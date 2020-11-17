const execa = require('execa');
const { join } = require('path');

const CLI_PATH = join(__dirname, '..', '..', 'bin');

// Create config.json for testing purpose
const createUserConfig = (trackName, fileExtension, keysCount) => {
  const userConfig = {
    learningTrack: '',
    userName: 'testConfig',
    taskCount: 0,
    keys: [],
    userSubmittedFiles: [],
  };
  userConfig['learningTrack'] = trackName;

  const filesCount = keysCount === 30 ? 30 : keysCount - 1;

  for (let i = 0; i < keysCount; i++) {
    userConfig['keys'].push(`testKey${i + 1}`);
  }
  for (let i = 0; i < filesCount; i++) {
    userConfig['userSubmittedFiles'].push(`task${i + 1}.${fileExtension}`);
  }
  userConfig['taskCount'] = filesCount;

  return userConfig;
};

const run = (args, options) => execa('node', [CLI_PATH].concat(args), options);

module.exports = {
  createUserConfig,
  run,
};
