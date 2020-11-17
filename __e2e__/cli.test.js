'use strict';

const test = require('ava');

const { run } = require('./commands/helpers');

test('supplying an unknown command errors', async t => {
  const { stderr } = await run(['create'], { reject: false });
  t.true(stderr.includes('Unknown command create'));
});
