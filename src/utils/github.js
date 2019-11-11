'use strict';

const axios = require('axios');
const chalk = require('chalk');
const execa = require('execa');
const inquirer = require('inquirer');

const validate = require('./validate');

// Global reference to the GitHub username.
let GHUserName;

/**
 * Initial Git workflow
 *
 * @returns {Promise<void>}
 */

const initializeGHWorkFlow = async () => {
  const { userName } = await inquirer.prompt({
    name: 'userName',
    message: 'GitHub username:-',
    type: 'input',
    validate,
  });

  // Holding global reference to the GitHub username.
  GHUserName = userName;

  // Check if it is a valid username
  if (!(await checkIfValidUser())) {
    await initializeGHWorkFlow();
  }
};

/**
 * Checks if the remote repository exists
 *
 * @returns {Promise<boolean>}
 */

const checkIfValidUser = async () => {
  const API_URL = `https://api.github.com/users/${GHUserName}`;
  try {
    await axios.get(API_URL);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Checks if the remote repository exists
 *
 * @returns {Promise<boolean>}
 */

const checkIfRepositoryExists = async () => {
  const API_URL = `https://api.github.com/repos/${GHUserName}/teachcode-solutions`;

  // Checking whether the remote repository exists.
  try {
    await axios.get(API_URL);
    return false;
  } catch (err) {
    // Repository should be created.
    return true;
  }
};

/**
 * Clone a remote repository to the local machine
 *
 * @returns {Promise<void>}
 */

const cloneRepository = async () => {
  const repoUrl = `https://github.com/${GHUserName}/teachcode-solutions`;
  await execa.shell(`git clone ${repoUrl}`);
};

/**
 * Create a remote repository
 *
 * @returns {Promise<void>}
 */

const createRepository = async () => {
  const { userToken } = await inquirer.prompt({
    name: 'userToken',
    message: 'GitHub user token:-',
    type: 'input',
    validate,
  });
  const API_URL = `https://api.github.com/user/repos?access_token=${userToken}`;

  // Create a new repository.
  try {
    await axios.post(API_URL, { name: 'teachcode-solutions' });
  } catch (err) {
    console.log(chalk.red.bold('Error: Invalid credentials'));
    console.log();
    await createRepository();
  }

  // Ensure repository creation.
  if (await checkIfRepositoryExists()) {
    console.log(chalk.red.bold('Error: Invalid credentials'));
    console.log();
    await createRepository();
  }
};
/**
 * Configure local repository
 *
 * @returns {Promise<void>}
 */

const configureLocalRepo = async () => {
  const repoUrl = `https://github.com/${GHUserName}/teachcode-solutions`;

  // Initialize an empty git repo.
  await execa.shell('git init');

  // Set the remote url.
  await execa.shell(`git remote add origin ${repoUrl}`);
};

/**
 * Creates a local commit on each submission
 *
 * @param {Number} taskCount - Holds the present task count
 * @returns {Promise<void>}
 */

const makeLocalCommit = async taskCount => {
  await execa.shell('git add .');
  await execa.shell(`git commit -m "solution for task-${taskCount}"`);
};

/**
 * Push to the remote repository once the current task was successfully completed
 *
 * @returns {Promise<void>}
 */

const pushToRemote = async () => {
  await execa.shell('git push origin master');
};

module.exports = {
  checkIfRepositoryExists,
  cloneRepository,
  configureLocalRepo,
  createRepository,
  initializeGHWorkFlow,
  makeLocalCommit,
  pushToRemote,
};
