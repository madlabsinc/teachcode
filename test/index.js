'use strict';

const path = require('path');
const execa = require('execa');
const test = require('ava');

const rootCommand = path.join(process.cwd(), 'bin/index.js');

test('shows up help message without any args', async t => {
  const { stdout } = await execa(rootCommand);
  t.snapshot(stdout);
});

['-V', '--version'].forEach(function(i) {
  test('shows version with arg ' + i, async t => {
    const { stdout } = await execa(rootCommand, [i]);
    t.snapshot(stdout);
  });
});
