'use strict';

const { showBanner } = require('../utils/banner');
const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');

let userData;

const showKeys = async () => {
  await showBanner();
  if (program.args.length > 1) {
    console.log(
      chalk.red(`\n ${chalk.yellow('showkeys')} don't take in any arguments`),
    );
    process.exit(1);
  }

  if (!fs.existsSync(process.cwd() + '/config.json')) {
    console.log(chalk.red("Config file doesn't exist!\n"));
    process.exit(1);
  }

  userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
  const { keys, userName, taskCount } = JSON.parse(userData);

  console.log(
    chalk.green(
      `\nUser: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/30`,
    ),
  );

  if (keys.length === 0) {
    console.log(
      chalk.magentaBright(
        '\n  Looks like this is your very first task. Fire in TeachCode fetchtask to start out!\n',
      ),
    );
  } else {
    keys.map((item, key) => {
      console.log(chalk.green(`\n Task-${key + 1}: ${item}`));
    });
  }
  console.log('\n');
};

module.exports = showKeys;
