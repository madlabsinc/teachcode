'use strict';

const path = require('path');
const test = require('ava');
const fs = require('fs');

const { createUserConfig, run } = require('../helpers/test-utils');

// All files for testing purpose are generated within the teachcode-solutions directory
const workDir = path.join(__dirname, 'teachcode-solutions');

// Path to config.json
const configFilePath = path.join(workDir, 'config.json');

// Create the teachcode-solutions directory
test.before(() => {
  fs.mkdirSync(workDir);
  const userConfig = createUserConfig('Python', 6);
  fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));
});

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

test.serial(
  'displays an appropriate message if the teachcode-solutions directory exists in path',
  async t => {
    const { code, stderr } = await run(['init'], {
      cwd: __dirname,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(code, 1);

    // Assert for the expected error message
    t.true(
      stderr
        .trim()
        .includes(
          'It seems that there is already a teachcode-solutions directory or config.json file existing in path',
        ),
    );
  },
);

test.serial(
  'displays an appropriate message if the config.json file exists in path',
  async t => {
    const { code, stderr } = await run(['init'], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(code, 1);

    // Assert for the expected error message
    t.true(
      stderr
        .trim()
        .includes(
          'It seems that there is already a teachcode-solutions directory or config.json file existing in path',
        ),
    );
  },
);
