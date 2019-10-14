'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');

const rootCommand = path.join(process.cwd(), 'bin/index.js');

test('shows up help message without any args', async t => {
  const { stdout } = await execa(rootCommand);
  t.snapshot(stdout);
});

test('shows version with arg -V', async t => {
  const { stdout } = await execa(rootCommand, ["-V"]);
  t.snapshot(stdout);
});

test('shows version with arg --version', async t => {
  const { stdout } = await execa(rootCommand, ["--version"]);
  t.snapshot(stdout);
});

