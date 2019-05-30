'use strict';

const execa = require('execa');
const inquirer = require('inquirer');

const validateInput = require('../utils/validate');

const createRepository = async () => {
  const { userName } = await inquirer.prompt({
    name: 'userName',
    message: 'GitHub username:-',
    type: 'input',
    validate: validateInput,
  });

  const API_URL = 'https://api.github.com/user/repos';
  const options = `--silent -u ${userName} ${API_URL} -d '{"name":"teachcode-solutions"}'`;

  // Initialize an empty git repo.
  await execa('git', ['init']);

  // Create a new repository.
  await execa.shell(`curl ${options}`, { stdio: 'inherit' });
};

const pushToRemote = async msg => {
  await execa.shell('git add .');
  await execa.shell(`git commit -m ${msg}`);
  await execa.shell('git push origin master');
};

module.exports = {
  createRepository,
  pushToRemote,
};
