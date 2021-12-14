'use strict';

const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const showBanner = require('node-banner');
const open = require('open');
const ora = require('ora');

const logger = require('../utils/logger');

// GitHub workflow helpers.
const {
  checkIfRepositoryExists,
  cloneRepository,
  createRepository,
  configureLocalRepo,
  initializeGHWorkFlow,
} = require('../utils/github');

const validate = require('../utils/validate');

// Key for the very first task
const key = '5e06b81de9ac43218a974785ffce8146';

let userConfig = {
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

const showInstructions = () => {
  console.log();
  logger.success(' Perform the following steps:-');
  console.log();
  logger.info(' 1. cd teachcode-solutions');
  logger.info(` 2. teachcode fetchtask`);
};

/**
 * Opens up the default browser with information concerning
 * access token creation as required
 * @returns {Promise<void>}
 */

const promptAccessTokenCreation = async () => {
  const instructionsUrl =
    'https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line';

  console.log();
  logger.success(
    'You are required to have a personal access token for consuming the GitHub API.\nIf you do not have one, please follow these instructions.\n',
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
    ['./config.json', './teachcode-solutions'].some(path => fs.existsSync(path))
  ) {
    console.log();
    logger.error(
      `  It seems that there is already a ${chalk.yellow.bold(
        'teachcode-solutions',
      )} directory or ${chalk.yellow.bold(
        'config.json',
      )} file existing in path`,
    );
    process.exit(1);
  }

  console.log();
  logger.success(
    ` Welcome to teachcode${`\n`.repeat(2)}${`\t`.repeat(
      2,
    )} Points to ponder ${`\n`.repeat(
      4,
    )} 1. The files to submit the solutions are auto-created\n 2. Please pay attention to the desired output as specified in the task.\n 3. You have the provision to view previously submitted tasks ${`\n`.repeat(
      4,
    )}`,
  );

  // Prompt the user to choose between the available learning tracks
  const { learningTrackOfChoice } = await inquirer.prompt([
    {
      name: 'learningTrackOfChoice',
      type: 'list',
      message: 'Choose your track',
      choices: ['Python', 'JavaScript', 'Dart'],
    },
  ]);

  // Prompt the user asking for his/her name
  const { userName } = await inquirer.prompt([
    {
      name: 'userName',
      type: 'input',
      message: "What's your name:-",
      validate,
    },
  ]);

  // Setting up initial user-data config
  userConfig = {
    ...userConfig,
    learningTrack: learningTrackOfChoice,
    userName,
  };

  userConfig.keys.push(key);

  // Prompt for GitHub username.
  await initializeGHWorkFlow();

  // Check if the remote repository already exists.
  const shouldCreateRepository = await checkIfRepositoryExists();

  if (shouldCreateRepository) {
    await promptAccessTokenCreation();
    await createRepository();

    fs.mkdirSync('teachcode-solutions');
    fs.writeFileSync(
      'teachcode-solutions/config.json',
      JSON.stringify(userConfig, null, 2),
    );
    await configureLocalRepo();
  } else {
    const spinner = ora('Fetching user progress').start();
    try {
      // Clone the remote repository
      await cloneRepository();
    } catch (err) {
      spinner.fail('Something went wrong');
      throw err;
    }
    spinner.stop();
  }
  showInstructions();
};

module.exports = initTasks;
