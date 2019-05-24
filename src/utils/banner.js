'use strict';

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { promisify } = require('util');

const printTitle = promisify(figlet);

exports.showBanner = async () => {
  clear();
  try {
    const data = await printTitle('TeachCode');
    console.log(chalk.redBright(data));
    console.log(
      chalk.yellow(
        ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks\n`,
      ),
    );
  } catch (err) {
    console.err(err);
    process.exit(1);
  }
};
