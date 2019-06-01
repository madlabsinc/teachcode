'use strict';

const axios = require('axios');
const execa = require('execa');
const inquirer = require('inquirer');
const { promisify } = require('util');
const shell = require('shelljs');

const execAsync = promisify(shell.exec);

const validateInput = require('../utils/validate');

// Global reference to the GitHub username.
let GHUserName;

const initializeGHWorkFlow = async () => {
  const { userName } = await inquirer.prompt({
    name: 'userName',
    message: 'GitHub username:-',
    type: 'input',
    validate: validateInput,
  });

  // Holding global reference to the GitHub username.
  GHUserName = userName;

  // Check if the remote repository already exists and act accordingly.
  await checkIfRepositoryExists();
};

const checkIfRepositoryExists = async () => {
  const API_URL = `https://api.github.com/repos/${GHUserName}/teachcode-solutions`;
  let repoShouldBeCreated;

  // Checking whether the remote repository exists.
  try {
    await axios.get(API_URL);
    repoShouldBeCreated = false;
  } catch (err) {
    // Repository should be created.
    repoShouldBeCreated = true;
  }
  return repoShouldBeCreated;
};

const cloneRepository = async () => {
  const repoUrl = `https://github.com/${GHUserName}/teachcode-solutions`;
  await execa.shell(`git clone ${repoUrl}`);
};

const createRepository = async () => {
  const API_URL = 'https://api.github.com/user/repos';
  console.log(GHUserName);
  const options = `--silent --output /dev/null -u ${GHUserName} ${API_URL} -d '{"name":"teachcode-solutions"}'`;

  // Create a new repository.
  await execa.shell(`curl ${options}`, { stdio: 'inherit' });
};

const configureLocalRepo = async () => {
  const repoUrl = `https://github.com/${GHUserName}/teachcode-solutions`;

  // Initialize an empty git repo.
  await execa('git', ['init']);

  // Set the remote url.
  await execa.shell(`git remote add origin ${repoUrl}`);
};

const makeLocalCommit = async taskCount => {
  await execa.shell('git add .');
  await execa.shell(`git commit -m "solution for task-${taskCount}"`);
};

const pushToRemote = async () => {
  await execAsync('git push origin master', { silent: 'true' });
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
