'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');
const fs = require('fs');

const rootCommand = path.join(process.cwd(), 'bin/index.js');
const configFilePath = path.join(process.cwd(), 'config.json');

const validConfigJson = {
  userName: 'validConfigJson',
  taskCount: 0,
};

test.serial('no config file for showcommands', async t => {
  if (fs.existsSync(configFilePath)) fs.unlinkSync(configFilePath);
  const { stdout } = await execa(rootCommand, ['showcommands'], {
    reject: false,
  });
  t.snapshot(stdout);
});

test.serial('config file present for showcommands', async t => {
  fs.writeFileSync('config.json', JSON.stringify(validConfigJson));
  const { stdout } = await execa(rootCommand, ['showcommands']);
  t.snapshot(stdout);
  fs.unlinkSync(configFilePath);
});
