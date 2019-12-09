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
  const { stdout } = await execa(rootCommand, ['-V']);
  t.snapshot(stdout);
});

test('shows version with arg --version', async t => {
  const { stdout } = await execa(rootCommand, ['--version']);
  t.snapshot(stdout);
});

test('shows help with arg --help', async t => {
  const { stdout } = await execa(rootCommand, ['--help']);
  t.snapshot(stdout);
});

test('shows help with arg -h', async t => {
  const { stdout } = await execa(rootCommand, ['-h']);
  t.snapshot(stdout);
});

test('shows unknown commands with arg junkcmd', async t => {
  const { stdout } = await execa(rootCommand, ['junkcmd']);
  t.snapshot(stdout);
});

test('rejects promise due to error with arg -a', async t => {
  const { stderr } = await execa(rootCommand, ['-a'], {reject:false});
  t.snapshot(stderr);
});
