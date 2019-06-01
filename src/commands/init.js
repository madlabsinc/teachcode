'use strict';

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');

// GitHub workflow helper methods.
const {
  checkIfRepositoryExists,
  cloneRepository,
  createRepository,
  configureLocalRepo,
  initializeGHWorkFlow,
} = require('../utils/github');

const { showBanner } = require('../utils/banner');
const validateInput = require('../utils/validate');

// Key for the very first task
let key = '5e06b81de9ac43218a974785ffce8146';

const userConfig = {
  learningTrack: '',
  userName: '',
  taskCount: 0,
  keys: [],
  userSubmittedFiles: [],
};

const showInstructions = () => {
  console.log();
  console.log(chalk.green.bold(' Perform the following:-'));
  console.log();
  console.log(chalk.cyanBright('1. cd teachcode-solutions'));
  console.log(chalk.green(`2. teachcode fetchtask ${key}`));
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
      `\n Welcome to teachcode${`\n`.repeat(2)}${`\t`.repeat(
        2,
      )} Points to ponder ${`\n`.repeat(
        4,
      )} 1. Solution files are auto-created\n 2. Print out exactly what is required as given in the task\n 3. You have the provision to view previously submitted tasks ${`\n`.repeat(
        4,
      )}`,
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

  // Prompt for GitHub username.
  await initializeGHWorkFlow();

  // Check if the remote repository already exists.
  let shouldCreateRepository = await checkIfRepositoryExists();

  if (shouldCreateRepository) {
    await createRepository();

    execSync(`mkdir -p ${process.cwd()}/teachcode-solutions`);
    fs.writeFileSync(
      `teachcode-solutions/config.json`,
      JSON.stringify(userConfig),
    );

    process.chdir('teachcode-solutions');
    await configureLocalRepo();

    showInstructions();
  } else {
    // Clone the remote repository
    await cloneRepository();
    showInstructions();
  }
};

module.exports = initTasks;
