'use strict';

const path = require('path');
const test = require('ava');
const fs = require('fs');

// const workspacePath = path.join(__dirname, '..', '..', 'src', 'workspace');

const { createUserConfig, run } = require('../helpers/test-utils');

// All files for testing purpose are generated within the teachcode-solutions directory
const workDir = path.join(__dirname, 'teachcode-solutions');

// Path to config.json
const configFilePath = path.join(workDir, 'config.json');

// Create the teachcode-solutions directory
test.before(() => fs.mkdirSync(workDir));

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

test.serial('no config file in the current path should error', async t => {
  const { code, stderr } = await run(['submit'], {
    cwd: workDir,
    reject: false,
  });

  // Assertions
  // Exit code
  t.is(code, 1);

  // Assert for the expected error message
  t.is(stderr.trim(), 'Could not find config.json in the current path!');
});

test.serial(
  'displays an appropriate message if the user is just starting out',
  async t => {
    // Create config.json
    const userConfig = createUserConfig('Python', 0);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { code, stdout } = await run(['submit'], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(code, 0);

    // Assert for the expected error message
    t.true(
      stdout.includes(
        'Please use teachcode fetchtask to fetch your very first task',
      ),
    );
  },
);
