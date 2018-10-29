const fs = require('fs');
const showBanner = require('../utils/banner');

let showKeys = () => {
	showBanner();
	setTimeout( () => {
		/* try{
			shell.cd('Teach-Code-solutions');
		}catch(e){
			console.log('Error!');
		} */
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log('Config file doesn\'t exist!');
		process.exit(1);
	}
	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);
  if(userDataJSON.keys.length === 0){
      console.log('\nLooks like this is your very first task. Fire in TeachCode fetchtask to start out!');
  } else{
      userDataJSON.keys.map((item, key) => {
        console.log(`\nTask-${key}: ${item}`);
      });
  }
	}, 100);
}

module.exports = showKeys;
