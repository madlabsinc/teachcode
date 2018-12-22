const fs = require('fs');
const showBanner = require('./utils/banner');
const chalk = require('chalk');

let showKeys = () => {
	showBanner();
	setTimeout( () => {

		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log(chalk.red('Config file doesn\'t exist!\n'));
		process.exit(1);
	}
	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);
	console.log(chalk.green(`\nUser: ${userDataJSON.username}\t\t\t\t\t\tProgress: ${userDataJSON.taskCount + 1}/30`));
  if(userDataJSON.keys.length === 0){
      console.log(chalk.magentaBright('\n  Looks like this is your very first task. Fire in TeachCode fetchtask to start out!\n'));
  } else{
      userDataJSON.keys.map((item, key) => {
        console.log(chalk.green(`\n Task-${key + 1}: ${item}`));
      });
  }
	console.log('\n');
	}, 100);
}

module.exports = showKeys;
