'use strict';

const { showBanner } = require('../utils/banner');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');
const os = require('os');
const program = require('commander');

let exercises;
let userData;
let fileName;
let learningTrack;

const fetchTask = async key => {
  await showBanner();
  if (program.args.length > 2) {
    console.log(
      chalk.red(
        `\n ${chalk.yellow('fetchtask')} only takes in the key as an argument`,
      ),
    );
    process.exit(1);
  }

  if (!fs.existsSync(process.cwd() + '/config.json')) {
    console.log(
      chalk.red(
        ' Make sure that you are within the Teach-Code-solutions directory!\n',
      ),
    );
    console.log(
      chalk.magentaBright('\tcd Teach-Code-solutions may resolve the issue!\n'),
    );
    process.exit(1);
  }

  userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
  const { userName, userSubmittedFiles, taskCount, keys } = JSON.parse(
    userData,
  );

  if (learningTrack === 'Python') {
    fileName = `task${taskCount + 1}.py`;
    exercises = require('../workspace/python/tasks');
  } else {
    fileName = `task${taskCount + 1}.js`;
    exercises = require('../workspace/js/tasks');
  }

  for (let index = 0; index < keys.length - 1; index++) {
    if (keys[index] === key) {
      console.log(
        chalk.yellowBright('\n\n This task is already completed! \n\n'),
      );
      console.log(
        chalk.green(
          `\nUser: ${userName}${`\t`.repeat(4)}Progress: ${taskCount + 1}/${
            exercises.length
          }`,
        ),
      );
      console.log(chalk.green(`\n${exercises[index].task}\n`));
      process.exit(1);
    }
  }

  if (taskCount === exercises.length) {
    console.log(chalk.redBright('\nNo more tasks available!'));
    process.exit(1);
  }

  if (keys.slice(-1).pop() === key) {
    userSubmittedFiles.push(fileName);
    fs.writeFileSync(process.cwd() + '/config.json', userData);

    console.log(
      chalk.cyan(
        `\nUser: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/${
          exercises.length
        }`,
      ),
    );
    console.log(chalk.green(`\n${exercises[taskCount].task}\n`));

    if (os.platform() !== 'win32') shell.exec(`touch ${fileName}`);
    else shell.exec(`notepad ${fileName}`);
  } else {
    console.log(
      chalk.red("\nMake sure that you've grabbed the key correctly!\n"),
    );
  }
};

module.exports = fetchTask;
