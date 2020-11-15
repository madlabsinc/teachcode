'use strict';

const fs = require('fs');
const chalk = require('chalk');
const showBanner = require('node-banner');

/**
 * Shows a list of keys that the user has hold of
 *
 * @returns {Promise<void>}
 */

const showKeys = async () => {
  await showBanner(
    'teachcode',
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`,
  );
  console.log();

  if (!fs.existsSync(`./config.json`)) {
    console.error(
      chalk.red(' Could not find config.json in the current path!'),
    );
    console.log();
    process.exit(1);
  }

  let userConfig = fs.readFileSync('./config.json', 'utf8');
  const { keys, userName, taskCount } = JSON.parse(userConfig);

  console.log();
  console.log(
    chalk.green(
      `User: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/30`,
    ),
  );

  if (keys.length === 0) {
    console.log();
    console.log(
      chalk.magentaBright(
        '  Looks like this is your very first task. Type in teachcode fetchtask to get started!',
      ),
    );
    console.log();
  } else {
    keys.map((item, key) => {
      console.log();
      console.log(chalk.green(` Task-${key + 1}: ${item}`));
    });
  }
};

module.exports = showKeys;
