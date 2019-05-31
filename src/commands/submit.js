'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');
const { PythonShell } = require('python-shell');

const { showBanner } = require('../utils/banner');
const { pushToRemote } = require('../utils/github');

const keyStore = '123456789abcedefghijklmnopqrstuvwxyz';

let exercises;
let userConfig;
let generatedKey;
let solutionFile;
let fileExtension;

const generateKey = () => {
  let key = '';
  for (let i = 0; i < 36; i++)
    key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
  return key;
};

// Keywords for validating solutions
const validationKeys = [
  'len',
  '/3',
  'if',
  'for',
  'while',
  'for',
  'if',
  '/3',
  '/2',
  'strip',
  ':',
  ':',
  'def',
  'if',
  'return',
  'asctime',
  'math.sqrt',
  '[',
  '[',
  'append',
  'else',
  '{',
  'except',
  'return',
  'range',
  'for',
  '%',
  '[::',
];

const checkSolution = async (submittedFileContent, solutionFileContent) => {
  let { taskCount, keys } = userConfig;
  try {
    if (submittedFileContent.toString() === solutionFileContent.toString()) {
      taskCount += 1;
      await pushToRemote(taskCount);

      if (taskCount === exercises.length) {
        console.log(chalk.greenBright("\n  Hurray you've done it!\n"));
        console.log(
          chalk.cyan.bold(' Info: ') +
            chalk.yellow.bold('No more tasks available!'),
        );
        process.exit(1);
      }

      generatedKey = generateKey();
      keys.push(generatedKey);

      fs.writeFileSync('./config.json', JSON.stringify(userConfig));
      console.log(
        chalk.green.bold(
          "\n  Hurray you've done it!\n  Key to access the next task: " +
            generatedKey +
            '\n',
        ),
      );
    } else {
      console.log(
        chalk.yellow.bold(
          "\n  The solution doesn't meet all the output requirements. Have a look again!\n",
        ),
      );
    }
  } catch (err) {
    console.log(
      chalk.red.bold(
        `\n There is something wrong with task${taskCount +
          1}.${fileExtension}`,
      ),
    );
  }
};

const validateSolution = solutionFile => {
  let fileContent = fs.readFileSync(solutionFile, 'utf8').toString();
  let { learningTrack, taskCount } = userConfig;

  // Validation for tasks submitted
  if (learningTrack === 'Python') {
    if (taskCount >= 2) {
      if (fileContent.includes(validationKeys[taskCount - 2])) {
        return;
      } else {
        console.log(
          chalk.red.bold(
            '\n Make sure that you use the required constructs as provided',
          ),
        );
        process.exit(1);
      }
    }
  } else {
    // TODO: Validation for JS solutions
  }
};

const submitTask = async () => {
  await showBanner();

  if (!fs.existsSync(`${process.cwd()}/config.json`)) {
    console.log(
      chalk.red.bold(
        ' Make sure that you are within the Teach-Code-solutions directory!\n',
      ),
    );
    console.log(
      chalk.magenta.bold('\tcd Teach-Code-solutions may resolve the issue!\n'),
    );
    process.exit(1);
  }

  userConfig = JSON.parse(
    fs.readFileSync(process.cwd() + '/config.json', 'utf8'),
  );
  let { userName, userSubmittedFiles, learningTrack, taskCount } = userConfig;

  if (learningTrack === 'Python') {
    exercises = require('../workspace/python/tasks');
    solutionFile = __dirname + '/../workspace/python' + exercises[taskCount].op;
    fileExtension = 'py';
  } else {
    exercises = require('../workspace/js/tasks');
    solutionFile = __dirname + '/../workspace/js' + exercises[taskCount].op;
    fileExtension = 'js';
  }

  if (taskCount !== exercises.length) {
    console.log(
      chalk.green(
        `\nUser: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/${
          exercises.length
        }`,
      ),
    );
  } else {
    console.log(
      chalk.green.bold(
        `\n  Congrats ${userName} you've made it through!\n  All tasks completed!\n`,
      ),
    );
    process.exit(1);
  }

  if (!userSubmittedFiles.length) {
    console.log(chalk.red('\n Use fetchtask to fetch your very first task'));
    process.exit(1);
  }

  if (taskCount === userSubmittedFiles.length) {
    console.log(chalk.yellow('\nTask already submitted!\n'));
    process.exit(1);
  }

  let submittedFile = userSubmittedFiles.slice(-1).pop();
  let submittedFileContent = fs
    .readFileSync(submittedFile, 'utf8')
    .toString()
    .split('');

  if (!submittedFileContent.length) {
    console.log(
      chalk.red(
        `\n Solution file task${taskCount + 1}.${fileExtension} is empty!\n`,
      ),
    );
    process.exit(1);
  }

  if (learningTrack === 'Python') {
    PythonShell.run(submittedFile, null, (err, result) => {
      if (err) {
        console.log(
          chalk.red.bold(
            '\n\tOops there is something wrong with the syntax part!\n',
          ),
        );
        console.log(err.toString());
        process.exit(1);
      }

      PythonShell.run(solutionFile, null, (err, solution) => {
        if (err) {
          console.log(chalk.red.bold('  ' + err.toString()));
          process.exit(1);
        }

        if (typeof result === 'undefined' || typeof solution === 'undefined') {
          console.log(
            chalk.red.bold(
              `\n Kindly have a look at task${taskCount}.${fileExtension}`,
            ),
          );
          process.exit(1);
        }
        validateSolution(submittedFile);
        checkSolution(result, solution);
      });
    });
  } else {
    exec(`node ${submittedFile}`, (err, result) => {
      if (err) throw err;
      exec(`node ${solutionFile}`, (err, solution) => {
        if (err) throw err;
        validateSolution(submittedFile);
        checkSolution(result, solution);
      });
    });
  }
};

module.exports = submitTask;
