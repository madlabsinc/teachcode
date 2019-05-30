'use strict';

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');

const { showBanner } = require('../utils/banner');

// Key for the very first task
let key = '5e06b81d-e9ac-4321-8a97-4785ffce8146';

const userConfig = {
  learningTrack: '',
  userName: '',
  taskCount: 0,
  keys: [],
  userSubmittedFiles: [],
};

/* const createRepo = () => {
  const API_URL = 'https://api.github.com/user/repos';
  let repoUrl;
  inquirer
    .prompt([
      {
        name: 'username',
        type: 'input',
        message: 'Your GitHub username:-',
      },
    ])
    .then(info => {
      shell.exec(
        `git init && curl --silent --output /dev/null -u ${
          info.username
        } ${API_URL} -d '{"name": "teachcode-solutions"}'`,
        err => {
          if (err) throw err;
          repoUrl = `https://www.github.com/${
            info.username
          }/Teach-Code-solutions`;
          shell.exec(`git remote add origin ${repoUrl}`);
        },
      );
      console.log(
        chalk.cyanBright(
          `\n  cd Teach-Code-solutions\n  teach-code fetchtask ${initialKey}\n`,
        ),
      );
    });
}; */

const validateInput = userInput => {
  if (!userInput) {
    console.log('Name is required');
    return false;
  } else {
    return true;
  }
};

const initTasks = async () => {
  await showBanner();

  if (
    fs.existsSync(`${process.cwd()}/teachcode-solutions`) ||
    fs.existsSync(`${process.cwd()}/config.json`)
  ) {
    console.log(
      chalk.redBright(
        `\n  It seems that there is already a ${chalk.yellow(
          'Teach-Code-solutions',
        )} directory or ${chalk.yellow('config.json')} file existing in path\n`,
      ),
    );
    console.log(chalk.redBright('  Exiting!!\n'));
    process.exit(1);
  }

  console.log(
    chalk.greenBright(
      `\n Welcome to Teach-Code${`\n`.repeat(2)}${`\t`.repeat(
        2,
      )} Points to ponder ${`\n`.repeat(
        4,
      )} 1. Solution files are auto-created\n 2. Print out exactly what is required as given in the task\n 3.You can vew the previously submitted tasks anytime ${`\n`.repeat(
        4,
      )} Give your name below and type in:-\n`,
    ),
  );

  const { learningTrackOfChoice } = await inquirer.prompt([
    {
      name: 'learningTrackOfChoice',
      type: 'list',
      message: 'Choose your track',
      choices: ['Python', 'JavaScript'],
    },
  ]);

  const { userName } = await inquirer.prompt([
    {
      name: 'userName',
      type: 'input',
      message: "What's your name:-",
      validate: validateInput,
    },
  ]);

  // Setting up initial user-data config.
  userConfig.learningTrack = learningTrackOfChoice;
  userConfig.userName = userName;
  userConfig.keys.push(key);

  execSync(`mkdir -p ${process.cwd()}/teachcode-solutions`);
  fs.writeFileSync(
    `teachcode-solutions/config.json`,
    JSON.stringify(userConfig),
  );
};

module.exports = initTasks;
