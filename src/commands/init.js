'use strict';

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');
const showBanner = require('node-banner');
const open = require('open');

// GitHub workflow helper methods.
const {
  checkIfRepositoryExists,
  cloneRepository,
  createRepository,
  configureLocalRepo,
  initializeGHWorkFlow,
} = require('../utils/github');

const validate = require('../utils/validate');

// Key for the very first task
let key = '5e06b81de9ac43218a974785ffce8146';

const userConfig = {
  learningTrack: '',
  userName: '',
  taskCount: 0,
  keys: [],
  userSubmittedFiles: [],
};

/**
 * Displays the initial instructions
 *
 * @param {Boolean} kickStart - Identifies if the user is just starting out
 * @returns {Void}
 */

const showInstructions = kickStart => {
  console.log();
  console.log(chalk.green.bold(' Perform the following steps:-'));
  console.log();
  console.log(chalk.cyan.bold(' 1. cd teachcode-solutions'));

  key = kickStart ? key : '<key>';
  console.log(chalk.cyan.bold(` 2. teachcode fetchtask`));
};

const promptAccessTokenCreation = async () => {
  const instructionsUrl =
    'https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line';
  console.log();
  console.log(
    chalk.greenBright(
      'You are required to have a personal access token for consuming the GitHub API.\nIf you do not have one, please follow these instructions.\n',
    ),
  );
  const { openInBrowser } = await inquirer.prompt([
    {
      name: 'openInBrowser',
      type: 'confirm',
      message: 'Open browser to read instructions?',
    },
  ]);
  if (openInBrowser) {
    // open link in the default browser
    await open(instructionsUrl);
  }
};

/**
 * Initialize all the tasks
 *
 * @returns {Promise<void>}
 */

const initTasks = async () => {
  await showBanner(
    'teachcode',
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`,
  );
  console.log();

  if (
    fs.existsSync(`${process.cwd()}/teachcode-solutions`) ||
    fs.existsSync(`${process.cwd()}/config.json`)
  ) {
    console.log();
    console.log(
      chalk.redBright(
        `  It seems that there is already a ${chalk.yellow(
          'Teach-Code-solutions',
        )} directory or ${chalk.yellow('config.json')} file existing in path`,
      ),
    );
    console.log();
    console.log(chalk.redBright('  Exiting!!'));
    console.log();
    process.exit(1);
  }

  console.log();
  console.log(
    chalk.greenBright(
      ` Welcome to teachcode${`\n`.repeat(2)}${`\t`.repeat(
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
      validate,
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

  // Tracks whether the user is just starting out.
  let kickStart;

  if (shouldCreateRepository) {
    await promptAccessTokenCreation();
    await createRepository();
    kickStart = true;

    execSync(`mkdir -p teachcode-solutions`);
    fs.writeFileSync(
      `teachcode-solutions/config.json`,
      JSON.stringify(userConfig),
    );

    process.chdir('teachcode-solutions');
    await configureLocalRepo();
  } else {
    // Clone the remote repository
    await cloneRepository();
    kickStart = false;
  }
  showInstructions(kickStart);
};

module.exports = initTasks;
