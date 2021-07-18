"use strict";

const chalk = require("chalk");

const error = (msg) => console.error(chalk.red.bold(msg));

const info = (msg) => console.info(chalk.cyan.bold(msg));

const success = (msg) => console.log(chalk.green.bold(msg));

const warn = (msg) => console.warn(chalk.yellow.bold(msg));

module.exports = {
  error,
  info,
  success,
  warn,
};
