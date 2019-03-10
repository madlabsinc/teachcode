'use strict';

const chalk = require('chalk');

const { showBanner } = require('../utils/banner');
const { version } = require('../../package.json');

exports.versionInfo = () => {
    showBanner();
    setTimeout(() => {
     console.log(chalk.cyanBright(`\n\n  Teach-Code: ${chalk.yellowBright(`${version}`)}`));
     console.log(chalk.cyanBright(`\n  Node: ${chalk.yellowBright(`${require('child_process').execSync('node -v')}`)}`));
     console.log(chalk.cyanBright(`  OS: ${chalk.yellowBright(`${process.platform}`)}\n`));
    }, 100);
};
