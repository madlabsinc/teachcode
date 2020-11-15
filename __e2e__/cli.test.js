'use strict';

const test = require('ava');

const run = require('./commands/helpers');

test('shows up help message without any args', async t => {
  const { stdout } = await run([]);
  t.snapshot(stdout);
});

const matchSnapshot = async (t, arg) => {
  const { stdout } = await run([arg]);
  t.snapshot(stdout);
};

test('shows version with arg --version', matchSnapshot, '--version');
test('shows version with arg -V', matchSnapshot, '-V');
test('shows help with arg -h', matchSnapshot, '-h');
test('shows help with arg --help', matchSnapshot, '--help');
test('shows command usage with unknown command', matchSnapshot, 'junkcmd');

test('rejects promise due to error with arg -a', async t => {
  const { stderr } = await run(['-a'], { reject: false });
  t.snapshot(stderr);
});
