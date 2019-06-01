'use strict';

const { showBanner } = require('../utils/banner');
const fs = require('fs');
const chalk = require('chalk');

let userData;

const showKeys = async () => {
  await showBanner();

  if (!fs.existsSync(process.cwd() + '/config.json')) {
    console.log(chalk.red("Config file doesn't exist!"));
    console.log();
    process.exit(1);
  }

  userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
  const { keys, userName, taskCount } = JSON.parse(userData);

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
        '  Looks like this is your very first task. Fire in TeachCode fetchtask to start out!',
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
