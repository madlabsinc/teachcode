'use strict';

const execa = require('execa');
const inquirer = require('inquirer');
const { promisify } = require('util');
const shell = require('shelljs');

const execAsync = promisify(shell.exec);

const validateInput = require('../utils/validate');

// Global reference to the GitHub username.
let GHUserName;

const createRepository = async () => {
  const { userName } = await inquirer.prompt({
    name: 'userName',
    message: 'GitHub username:-',
    type: 'input',
    validate: validateInput,
  });

  GHUserName = userName;

  const API_URL = 'https://api.github.com/user/repos';
  const options = `--silent --output /dev/null -u ${userName} ${API_URL} -d '{"name":"teachcode-solutions"}'`;

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

const pushToRemote = async taskCount => {
  try {
    await execa.shell('git add .');
    await execa.shell(`git commit -m "solution for task-${taskCount}"`);
    await execAsync('git push origin master', { silent: 'true' });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRepository,
  pushToRemote,
  configureLocalRepo,
};
