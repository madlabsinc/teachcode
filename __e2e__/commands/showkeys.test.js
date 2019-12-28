'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');
const fs = require('fs');

const rootCommand = path.join(process.cwd(), 'bin/index.js');
const configFilePath = path.join(process.cwd(), 'config.json');

const configWithoutKeys = { userName: 'TestJsonNoKeys', taskCount: 0, keys: [] };
const configWithMultipleKeys = {
  userName: 'TestJsonMultipleKeys',
  taskCount: 2,
  keys: ['testkey1', 'testkey2'],
};

// tests are serial as we are creating different temp config files for each tests
test.serial('no config file', async t => {
  if (fs.existsSync(configFilePath)) await execa('rm', ['config.json']);
  const { stdout } = await execa(rootCommand, ['showkeys'], { reject: false });
  t.snapshot(stdout);
});

test.serial('no keys in config file', async t => {
  fs.writeFileSync('config.json', JSON.stringify(configWithoutKeys));
  const { stdout } = await execa(rootCommand, ['showkeys'], { reject: false });
  t.snapshot(stdout);
  await execa('rm', ['config.json']);
});

test.serial('multiple keys in config file', async t => {
  fs.writeFileSync('config.json', JSON.stringify(configWithMultipleKeys));
  const { stdout } = await execa(rootCommand, ['showkeys'], { reject: false });
  t.snapshot(stdout);
  await execa('rm', ['config.json']);
});
