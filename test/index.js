'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');

const rootCommand = path.join(process.cwd(), 'bin/index.js');

test('shows up help message without any args', async t => {
  const { stdout } = await execa(rootCommand);
  t.snapshot(stdout);
});

const macro = async (t, input) => {
  const { stdout } = await execa(rootCommand, [input]);
  t.snapshot(stdout);
}

macro.title = (providedTitle = undefined, input) => providedTitle;

test('shows version with arg --version', macro, '--version');
test('shows version with arg -V', macro, '-V');
test('shows help with arg -h', macro, '-h');
test('shows help with arg --help', macro, '--help');
test('shows command usage with unknown command', macro, 'junkcmd');

test('rejects promise due to error with arg -a', async t => {
  const { stderr } = await execa(rootCommand, ['-a'], {reject:false});
  t.snapshot(stderr);
});
