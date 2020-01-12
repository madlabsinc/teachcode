'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');
const fs = require('fs');

const rootCommand = path.join(process.cwd(), 'bin/index.js');
const configFilePath = path.join(process.cwd(), 'config.json');

const learningTracksInfo = [
  { trackName: 'Python', fileExtension: 'py' },
  { trackName: 'JavaScript', fileExtension: 'js' },
];

const userDefaultConfig = {
  learningTrack: '',
  userName: 'testConfig',
  taskCount: 0,
  keys: [],
  userSubmittedFiles: [],
};

const createUserConfig = (
  trackName,
  fileExtension,
  keysNumber,
  filesNumber,
) => {
  let userConfig = userDefaultConfig;
  userConfig['learningTrack'] = trackName;
  for (let i = 0; i < keysNumber; i++) {
    userConfig['keys'].push(`testKey${i + 1}`);
  }
  for (let i = 0; i < filesNumber; i++) {
    userConfig['userSubmittedFiles'].push(`task${i + 1}.${fileExtension}`);
  }
  userConfig['taskCount'] = filesNumber;

  return userConfig;
};

test.serial('no config file for fetchtask', async t => {
  if (fs.existsSync(configFilePath)) fs.unlinkSync(configFilePath);
  const { stdout } = await execa(rootCommand, ['fetchtask'], {
    reject: false,
  });
  t.snapshot(stdout);
});

test.serial('incorrect key for fetchtask', async t => {
  let snap = null;
  t.assert(learningTracksInfo.length > 0);
  for (let index in learningTracksInfo) {
    let { trackName, fileExtension } = learningTracksInfo[index];
    const userConfig = createUserConfig(trackName, fileExtension, 30, 30);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig));
    const { stdout } = await execa(
      rootCommand,
      ['fetchtask', 'incorrectTestKey'],
      { reject: false },
    );
    fs.unlinkSync(configFilePath);
    if (snap) {
      t.true(snap === stdout);
    } else {
      snap = stdout;
    }
  }
  t.snapshot(snap);
});

test.serial('display completed task with fetchtask key', async t => {
  t.assert(learningTracksInfo.length > 0);
  for (let index in learningTracksInfo) {
    let { trackName, fileExtension } = learningTracksInfo[index];
    let userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig));
    const { stdout } = await execa(rootCommand, ['fetchtask', 'testKey2']);
    t.snapshot(stdout);
    fs.unlinkSync(configFilePath);
  }
});

test.serial('display incomplete task with fetchtask key', async t => {
  t.assert(learningTracksInfo.length > 0);
  for (let index in learningTracksInfo) {
    let { trackName, fileExtension } = learningTracksInfo[index];
    let userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig));
    const { stdout } = await execa(rootCommand, ['fetchtask', 'testKey6']);
    t.snapshot(stdout);
    fs.unlinkSync(configFilePath);
    fs.unlinkSync(path.join(process.cwd(), `task6.${fileExtension}`));
  }
});

test.serial('no more tasks available', async t => {
  let snap = null;
  t.assert(learningTracksInfo.length > 0);
  for (let index in learningTracksInfo) {
    let { trackName, fileExtension } = learningTracksInfo[index];
    const userConfig = createUserConfig(trackName, fileExtension, 30, 30);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig));
    const { stdout } = await execa(rootCommand, ['fetchtask'], {
      reject: false,
    });
    if (snap) {
      t.assert(snap === stdout);
    } else {
      snap = stdout;
    }
    fs.unlinkSync(configFilePath);
  }
  t.snapshot(snap);
});

test.serial('display next task with fetchtask', async t => {
  t.assert(learningTracksInfo.length > 0);
  for (let index in learningTracksInfo) {
    let { trackName, fileExtension } = learningTracksInfo[index];
    const userConfig = createUserConfig(trackName, fileExtension, 6, 5);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig));
    const { stdout } = await execa(rootCommand, ['fetchtask']);
    t.snapshot(stdout);
    fs.unlinkSync(configFilePath);
    fs.unlinkSync(path.join(process.cwd(), `task6.${fileExtension}`));
  }
});
