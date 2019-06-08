'use strict';

const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const showBanner = require('node-banner');

const fetchTask = async key => {
  await showBanner(
    'teachcode',
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`,
  );
  console.log();

  let exercises;
  let fileName;

  if (!fs.existsSync(process.cwd() + '/config.json')) {
    console.log(
      chalk.red.bold(
        ' Make sure that you are within the teachcode-solutions directory!',
      ),
    );
    console.log();
    console.log(
      chalk.cyan.bold('\tcd teachcode-solutions may resolve the issue!'),
    );
    console.log();
    process.exit(1);
  }

  // Reading the user-config information.
  let userConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

  const {
    learningTrack,
    userName,
    userSubmittedFiles,
    taskCount,
    keys,
  } = userConfig;

  if (learningTrack === 'Python') {
    fileName = `task${taskCount + 1}.py`;
    exercises = require('../workspace/python/tasks');
  } else {
    fileName = `task${taskCount + 1}.js`;
    exercises = require('../workspace/js/tasks');
  }

  // Holding reference to keys of all the completed tasks
  let previousKeys = keys.slice(0, keys.length - 1);

  let taskAlreadyCompleted = [];

  previousKeys.some((item, index) => {
    if (item === key) {
      taskAlreadyCompleted = [true, index];
      return true;
    }
  });

  if (taskAlreadyCompleted[0]) {
    console.log();
    console.log(chalk.yellow.bold(' This task is already completed!'));
    console.log();
    console.log();
    console.log(
      chalk.green.bold(
        `User: ${userName}${`\t`.repeat(4)}Progress: ${taskCount + 1}/${
          exercises.length
        }`,
      ),
    );
    console.log();
    console.log(chalk.green(`${exercises[taskAlreadyCompleted[1]].task}`));
    console.log();
    process.exit(1);
  }

  if (taskCount === exercises.length) {
    console.log();
    console.log(chalk.red.bold('No more tasks available!'));
    process.exit(1);
  }

  if (keys.slice(-1).pop() === key) {
    if (userSubmittedFiles.indexOf(fileName) === -1) {
      userSubmittedFiles.push(fileName);
    }

    fs.writeFileSync('./config.json', JSON.stringify(userConfig));

    console.log();
    console.log(
      chalk.cyan.bold(
        `User: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/${
          exercises.length
        }`,
      ),
    );
    // Displaying respective task within the the console screen.
    console.log();
    console.log(chalk.green(`${exercises[taskCount].task}`));
    console.log();

    let createCmd = process.platform !== 'win32' ? 'touch' : 'notepad';
    execSync(`${createCmd} ${fileName}`);
  } else {
    console.log();
    console.log(
      chalk.red.bold("Make sure that you've grabbed the key correctly!"),
    );
    console.log();
  }
};

module.exports = fetchTask;
