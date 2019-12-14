'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const showBanner = require('node-banner');

const { makeLocalCommit, pushToRemote } = require('../utils/github');

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

/**
 * Compares the user submitted solution (result) with that of the predefined version
 *
 * @param {String} submittedFileContent - Content of the submitted solution file
 * @param {String} solutionFileContent - Predefined solution file content
 * @returns {Promise<void>}
 */

const checkSolution = async (submittedFileContent, solutionFileContent) => {
  let { taskCount, keys } = userConfig;
  try {
    if (submittedFileContent.toString() === solutionFileContent.toString()) {
      generatedKey = generateKey();

      // Updating config.json information.
      taskCount += 1;
      keys.push(generatedKey);

      userConfig = {
        ...userConfig,
        taskCount,
        keys,
      };
      fs.writeFileSync('./config.json', JSON.stringify(userConfig));

      await makeLocalCommit(taskCount);

      let condition = true;
      do {
        try {
          await pushToRemote();
          break;
        } catch (err) {
          console.log(chalk.red.bold('Error: Invalid credentials'));
          // The method gets invoked again as invalid credentials were provided.
        }
      } while (condition);

      if (taskCount === exercises.length) {
        console.log();
        console.log(chalk.greenBright("  Hurray you've done it!"));
        console.log();
        console.log(
          chalk.cyan.bold(' Info: ') +
            chalk.yellow.bold('No more tasks available!'),
        );
        process.exit(1);
      }

      console.log();
      console.log(
        chalk.green.bold("  Hurray you've done it!\n  Move to the next task"),
      );
      console.log();
    } else {
      console.log();
      console.log(
        chalk.yellow.bold(
          "  The solution doesn't meet all the output requirements. Have a look again!",
        ),
      );
      console.log();
    }
  } catch (err) {
    console.log();
    console.log(
      chalk.red.bold(
        ` There is something wrong with task${taskCount + 1}.${fileExtension}`,
      ),
    );
  }
};

/**
 * Validates if the solution meets all the criteria
 *
 * @param {any} solutionFile - User submitted file
 * @returns {Void}
 */

const validateSolution = solutionFile => {
  let fileContent = fs.readFileSync(solutionFile, 'utf8').toString();
  let { learningTrack, taskCount } = userConfig;

  // Validation for tasks submitted
  if (learningTrack === 'Python') {
    if (taskCount >= 2) {
      if (fileContent.includes(validationKeys[taskCount - 2])) {
        return;
      } else {
        console.log();
        console.log(
          chalk.red.bold(
            ' Make sure that you use the required constructs as provided',
          ),
        );
        process.exit(1);
      }
    }
  } else {
    // TODO: Validation for JS solutions
  }
};

/**
 * Solution submission logic
 *
 * @returns {Void}
 */

const submitTask = async () => {
  await showBanner(
    'teachcode',
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`,
  );
  console.log();

  if (!fs.existsSync(`${process.cwd()}/config.json`)) {
    console.log(
      chalk.red.bold(
        ' Make sure that you are within the Teach-Code-solutions directory!',
      ),
    );
    console.log();
    console.log(
      chalk.magenta.bold('\tcd Teach-Code-solutions may resolve the issue!'),
    );
    console.log();
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
    console.log();
    console.log(
      chalk.green(
        `User: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/${
          exercises.length
        }`,
      ),
    );
  } else {
    console.log();
    console.log(
      chalk.green.bold(
        `  Congrats ${userName} you've made it through!\n  All tasks completed!`,
      ),
    );
    console.log();
    process.exit(1);
  }

  if (!userSubmittedFiles.length) {
    console.log();
    console.log(
      chalk.cyan(' Warning: Use fetchtask to fetch your very first task'),
    );
    process.exit(1);
  }

  if (taskCount === userSubmittedFiles.length) {
    console.log();
    console.log(
      chalk.cyan.bold(' Info: ') + chalk.yellow.bold('Task already submitted!'),
    );
    console.log();
    process.exit(1);
  }

  let submittedFile = userSubmittedFiles.slice(-1).pop();
  let submittedFileContent = fs
    .readFileSync(submittedFile, 'utf8')
    .toString()
    .split('');

  if (!submittedFileContent.length) {
    console.log();
    console.log(
      chalk.red(
        ` Solution file task${taskCount + 1}.${fileExtension} is empty!`,
      ),
    );
    console.log();
    process.exit(1);
  }

  if (learningTrack === 'Python') {
    PythonShell.run(submittedFile, null, (err, result) => {
      if (err) {
        console.log();
        console.log(
          chalk.red.bold(
            '  Oops there is something wrong with the syntax part!',
          ),
        );
        console.log();
        console.log(err.toString());
        process.exit(1);
      }

      PythonShell.run(solutionFile, null, (err, solution) => {
        if (err) {
          console.log(chalk.red.bold('  ' + err.toString()));
          process.exit(1);
        }

        if (typeof result === 'undefined' || typeof solution === 'undefined') {
          console.log();
          console.log(
            chalk.red.bold(
              ` Kindly have a look at task${taskCount}.${fileExtension}`,
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
      if (err) {
        console.log(
          chalk.red.bold(
            '  Oops there is something wrong with the syntax part!',
          ),
        );
        process.exit(1);
      }
      exec(`node ${solutionFile}`, (err, solution) => {
        if (err) throw err;
        validateSolution(submittedFile);
        checkSolution(result, solution);
      });
    });
  }
};

module.exports = submitTask;
