'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');

const rootCommand = path.join(process.cwd(), 'bin/index.js');

test('shows up help message without any args', async t => {
  const { stdout } = await execa(rootCommand);
  t.snapshot(stdout);
});

const matchSnapshot = async (t, arg) => {
  const { stdout } = await execa(rootCommand, [arg]);
  t.snapshot(stdout);
};

test('shows version with arg --version', matchSnapshot, '--version');
test('shows version with arg -V', matchSnapshot, '-V');
test('shows help with arg -h', matchSnapshot, '-h');
test('shows help with arg --help', matchSnapshot, '--help');
test('shows command usage with unknown command', matchSnapshot, 'junkcmd');

test('rejects promise due to error with arg -a', async t => {
  const { stderr } = await execa(rootCommand, ['-a'], { reject: false });
  t.snapshot(stderr);
});
