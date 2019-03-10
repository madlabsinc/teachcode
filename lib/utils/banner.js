'use strict';

const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

exports.showBanner = () => {

  clear();
  setTimeout(() => {
    figlet('Teach-Code', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.redBright(data));
    console.log(chalk.yellow(' Learn python effectively...\t\t\tPowered by MadHacks\n'));
  });
  }, 50);
};
