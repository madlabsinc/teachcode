'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');
const fs = require('fs');

const rootCommand = path.join(process.cwd(), 'bin/index.js');
const configFilePath = path.join(process.cwd(), 'config.json');

const configWithoutKeys = {
  userName: 'configWithoutKeys',
  taskCount: 0,
  keys: [],
};
const configWithMultipleKeys = {
  userName: 'configWithMultipleKeys',
  taskCount: 2,
  keys: ['testkey1', 'testkey2'],
};

// tests are serial as we are creating different temp config files for each tests
test.serial('no config file', async t => {
  if (fs.existsSync(configFilePath)) fs.unlinkSync(configFilePath);
  const { stdout } = await execa(rootCommand, ['showkeys'], { reject: false });
  t.snapshot(stdout);
});

test.serial('no keys in config file', async t => {
  fs.writeFileSync('config.json', JSON.stringify(configWithoutKeys));
  const { stdout } = await execa(rootCommand, ['showkeys']);
  t.snapshot(stdout);
  fs.unlinkSync(configFilePath);
});

test.serial('multiple keys in config file', async t => {
  fs.writeFileSync('config.json', JSON.stringify(configWithMultipleKeys));
  const { stdout } = await execa(rootCommand, ['showkeys']);
  t.snapshot(stdout);
  fs.unlinkSync(configFilePath);
});
