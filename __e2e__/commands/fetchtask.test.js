'use strict';

const path = require('path');
const test = require('ava');
const fs = require('fs');

const workspacePath = path.join(__dirname, '..', '..', 'src', 'workspace');

const run = require('./helpers');

// All files for testing purpose are generated within the teachcode-solutions directory
const workDir = path.join(__dirname, 'teachcode-solutions');

// Path to config.json
const configFilePath = path.join(workDir, 'config.json');

const learningTracksInfo = [
  { trackName: 'Python', fileExtension: 'py' },
  { trackName: 'JavaScript', fileExtension: 'js' },
];

const createUserConfig = (trackName, fileExtension, keysCount, filesCount) => {
  // config.json
  const userConfig = {
    learningTrack: '',
    userName: 'testConfig',
    taskCount: 0,
    keys: [],
    userSubmittedFiles: [],
  };
  userConfig['learningTrack'] = trackName;
  for (let i = 0; i < keysCount; i++) {
    userConfig['keys'].push(`testKey${i + 1}`);
  }
  for (let i = 0; i < filesCount; i++) {
    userConfig['userSubmittedFiles'].push(`task${i + 1}.${fileExtension}`);
  }
  userConfig['taskCount'] = filesCount;

  return userConfig;
};

// Create the teachcode-solutions directory
test.before(() => fs.mkdirSync(workDir));

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

test.serial('no config file in the current path should error', async t => {
  const { code, stderr } = await run(['fetchtask'], {
    cwd: workDir,
    reject: false,
  });
  t.is(code, 1);
  t.is(stderr.trim(), 'Could not find config.json in the current path!');
});

test.serial('supplying an invalid key should error', async t => {
  for (const track of learningTracksInfo) {
    // Grab the keys using object destructuring
    const { trackName, fileExtension } = track;

    // Create config.json
    const userConfig = createUserConfig(trackName, fileExtension, 30, 30);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { code, stderr } = await run(['fetchtask', 'incorrectTestKey'], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    t.is(code, 1);
    t.is(stderr.trim(), 'Make sure that you have grabbed the key correctly!');
  }
});

test.serial('should be able to access a completed task', async t => {
  for (const track of learningTracksInfo) {
    // Grab the keys using object destructuring
    const { trackName, fileExtension } = track;

    // Create config.json
    const userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { code, stderr, stdout } = await run(['fetchtask', 'testKey2'], {
      cwd: workDir,
    });
    const tasksDir =
      trackName !== 'Python' ? fileExtension : trackName.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, 'tasks.json'));

    // Assertions
    t.is(code, 0);
    t.true(stderr.trim().includes('This task is already completed'));
    t.true(stdout.includes(tasks[1].task));
  }
});

test.serial('access the current task with the respective key', async t => {
  for (const track of learningTracksInfo) {
    // Grab the keys using object destructuring
    const { trackName, fileExtension } = track;
    const userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { code, stdout } = await run(['fetchtask', 'testKey6'], {
      cwd: workDir,
    });
    const tasksDir =
      trackName !== 'Python' ? fileExtension : trackName.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, 'tasks.json'));

    // Assertions
    t.is(code, 0);
    t.false(stdout.trim().includes('This task is already completed'));
    t.true(stdout.includes(tasks[5].task));
  }
});

test.serial(
  'displays an appropriate log if no more tasks are available',
  async t => {
    for (const track of learningTracksInfo) {
      // Grab the keys using object destructuring
      const { trackName, fileExtension } = track;
      const userConfig = createUserConfig(trackName, fileExtension, 30, 30);
      fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

      const { code, stderr } = await run(['fetchtask'], { cwd: workDir });

      // Assertions
      t.is(code, 0);
      t.true(stderr.trim().includes('No more tasks available!'));
    }
  },
);

test.serial('not supplying key fetches the next task', async t => {
  for (const track of learningTracksInfo) {
    // Grab the keys using object destructuring
    const { trackName, fileExtension } = track;
    const userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { code, stdout } = await run(['fetchtask'], { cwd: workDir });
    const tasksDir =
      trackName !== 'Python' ? fileExtension : trackName.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, 'tasks.json'));

    // Assertions
    t.is(code, 0);
    t.false(stdout.trim().includes('This task is already completed'));
    t.true(stdout.includes(tasks[5].task));
  }
});
