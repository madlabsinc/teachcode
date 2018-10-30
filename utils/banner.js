const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

let showBanner = () => {

  clear();
  setTimeout(() => {
    figlet('Teach-Code', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.redBright(data));
    console.log(chalk.yellow('Learn python effectively...\n'));
  });
  }, 50);

}

module.exports = showBanner;
