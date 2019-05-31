'use strict';

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');

const { createRepository, configureLocalRepo } = require('../utils/github');
const { showBanner } = require('../utils/banner');
const validateInput = require('../utils/validate');

// Key for the very first task
let key = '5e06b81d-e9ac-4321-8a97-4785ffce8146';

const userConfig = {
  learningTrack: '',
  userName: '',
  taskCount: 0,
  keys: [],
  userSubmittedFiles: [],
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

  try {
    await createRepository();
  } catch (err) {
    console.error(chalk.redBright(err));
    process.exit(1);
  }

  execSync(`mkdir -p ${process.cwd()}/teachcode-solutions`);
  fs.writeFileSync(
    `teachcode-solutions/config.json`,
    JSON.stringify(userConfig),
  );

  process.chdir('teachcode-solutions');
  configureLocalRepo();
};

module.exports = initTasks;
