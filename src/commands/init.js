'use strict';

const { showBanner } = require('../utils/banner');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const os = require('os');
const program = require('commander');

let taskCount = 0;
let initialKey = '5e06b81d-e9ac-4321-8a97-4785ffce8146';

let createRepo = () => {
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
        } ${API_URL} -d '{"name": "Teach-Code-solutions"}'`,
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
};

exports.initialize = async () => {
  await showBanner();
  if (program.args.length > 1) {
    console.log(
      chalk.red(`\n ${chalk.yellow('init')} don't take in any arguments`),
    );
    process.exit(1);
  }

  // Warning the user if he/she fires in the command again.
  if (
    fs.existsSync(process.cwd() + '/Teach-Code-solutions') ||
    fs.existsSync(process.cwd() + '/config.json')
  ) {
    console.log(
      chalk.red(
        `\n  It seems that there is already a ${chalk.yellow(
          'Teach-Code-solutions',
        )} directory or ${chalk.yellow('config.json')} file existing in path\n`,
      ),
    );
    console.log(chalk.magentaBright('  Exiting!!\n'));
    process.exit(1);
  }

  if (os.platform() !== 'win32')
    shell.exec(`mkdir ${process.cwd()}/Teach-Code-solutions`);
  else shell.exec(`mkdir Teach-Code-solutions`);

  shell.cd('Teach-Code-solutions');
  console.log(
    chalk.green(
      '\n Welcome to Teach-Code\n\n\t\t Points to ponder \n\n 1. Solution files are auto-created\n 2. Print out exactly what is required as given in the task\n 3.You can vew the previuosly submitted tasks anytime \n\n Give your name below and type in:-\n',
    ),
  );
  inquirer
    .prompt([
      {
        name: 'track',
        type: 'list',
        message: 'Choose your track',
        choices: ['Python', 'JavaScript'],
      },
    ])
    .then(choice => {
      inquirer
        .prompt([
          {
            name: 'username',
            type: 'input',
            message: "What's your name:-",
          },
        ])
        .then(answer => {
          if (answer.username === '') {
            console.log(chalk.red('\nName is required!\n'));
            shell.cd('../');
            if (process.platform !== 'win32')
              shell.exec('rm -r Teach-Code-solutions');
            else shell.exec('rmdir Teach-Code-solutions');
            process.exit(1);
          }
          fs.writeFileSync(
            process.cwd() + '/config.json',
            `{\n "track": "${choice.track}",\n "username": "${
              answer.username
            }",\n "taskCount": ${taskCount},\n "keys": ["5e06b81d-e9ac-4321-8a97-4785ffce8146"]\n,\n "files": []}`,
          );
          createRepo();
        });
    });
};
