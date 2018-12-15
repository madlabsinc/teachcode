const chalk = require('chalk');

const showBanner = require('../utils/banner');
const version = require('../package.json').version;

let versionInfo = () => {
    showBanner();
    setTimeout(() => {
     console.log(chalk.yellowBright(`\n\n  Teach-Code: ${version}`));
     console.log(chalk.yellowBright(`\n  Node: ${require('child_process').execSync('node -v')}`));
     console.log(chalk.yellowBright(`  OS: ${process.platform}\n`));
    }, 100);
}

module.exports = versionInfo;