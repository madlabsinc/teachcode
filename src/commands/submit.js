'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const showBanner = require('node-banner');
const path = require('path');

const fileExtensionMap = require('../utils/constants');
const logger = require('../utils/logger');
const { makeLocalCommit, pushToRemote } = require('../utils/github');

const keyStore = '123456789abcedefghijklmnopqrstuvwxyz';

let userConfig = {};

// Generate a random key that maps to a task
const generateKey = () => {
  let key = '';
  for (let i = 0; i < 36; i++) {
    key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
  }
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
 * @param {String} submittedFileContent - Content of the user submitted file
 * @param {String} solutionFileContent - Predefined solution file content
 * @param {Number} totalTasks - Total number of tasks for the respective learning track
 *
 * @returns {Promise<void>}
 */

const checkSolution = async (
  submittedFileContent,
  solutionFileContent,
  totalTasks,
) => {
  let { learningTrack, taskCount, keys } = userConfig;
  try {
    if (submittedFileContent.toString() === solutionFileContent.toString()) {
      // Updating config.json information.
      taskCount++;

      // Push a randomly generated key to the keys array
      keys.push(generateKey());

      userConfig = {
        ...userConfig,
        taskCount,
        keys,
      };

      // Write back the updated config
      fs.writeFileSync('./config.json', JSON.stringify(userConfig, null, 2));

      await makeLocalCommit(taskCount);

      // User is prompted for credentials unless they are valid
      do {
        try {
          await pushToRemote();
          break;
        } catch (err) {
          logger.error('Error: Invalid credentials');
        }
      } while (true); // eslint-disable-line

      // Successfully completed the task
      console.log();
      logger.success(` Hurray you've done it!`);
      console.log();

      // All tasks completed
      if (taskCount === totalTasks) {
        logger.info(' Info: No more tasks available!');
        process.exit(0);
      }

      logger.success(
        `Move to the next task with ${chalk.yellow.bold(
          'teachcode fetchtask',
        )}`,
      );
    } else {
      console.log();
      logger.warn(
        ` The solution doesn't meet all the output requirements. Please have a look again!`,
      );
      console.log();
    }
  } catch (err) {
    console.log();
    logger.error(
      ` There is something wrong with task${taskCount + 1}.${
        fileExtensionMap[learningTrack]
      }`,
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
  const fileContent = fs.readFileSync(solutionFile, 'utf8').toString();
  const { learningTrack, taskCount } = userConfig;

  // Validation for the submitted solution
  if (learningTrack === 'Python') {
    if (taskCount >= 2) {
      if (!fileContent.includes(validationKeys[taskCount - 2])) {
        console.log();
        logger.error(
          ' Make sure that you use the required constructs as provided',
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

  if (!fs.existsSync('./config.json')) {
    logger.error(' Could not find config.json in the current path!');
    console.log();
    process.exit(1);
  }

  // Read from config.json
  userConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  const { userName, userSubmittedFiles, learningTrack, taskCount } = userConfig;

  const fileExtension = fileExtensionMap[learningTrack];
  const tasksDir = learningTrack === 'Python' ? 'python' : fileExtension;

  // Path to the tasks and their solutions
  const workSpacePath = path.join(__dirname, '..', 'workspace');
  const exercises = require(path.join(workSpacePath, tasksDir, 'tasks'));

  const solutionFile = path.join(
    workSpacePath,
    'solutions',
    `${taskCount + 1}.${fileExtension}`,
  );

  if (taskCount !== exercises.length) {
    console.log();
    const progressInfo = `${taskCount + 1}/${exercises.length}`;
    logger.success(
      `User: ${userName}${`\t`.repeat(6)}Progress: ${progressInfo}`,
    );
  } else {
    console.log();

    logger.success(` Congrats ${userName} you've made it through!`);
    console.log();

    logger.success(' All tasks completed!');
    console.log();
    process.exit(0);
  }

  if (!userSubmittedFiles.length) {
    console.log();
    logger.info(
      ` Please use ${chalk.yellow.bold(
        'teachcode fetchtask',
      )} to fetch your very first task`,
    );
    process.exit(0);
  }

  if (taskCount === userSubmittedFiles.length) {
    console.log();
    logger.info(' Info: Task already submitted!');
    console.log();
    process.exit(0);
  }

  const submittedFile = userSubmittedFiles.slice(-1).pop();
  const submittedFileContent = fs
    .readFileSync(submittedFile, 'utf8')
    .toString()
    .split('');

  if (!submittedFileContent.length) {
    console.log();
    logger.error(
      ` Solution file task${taskCount + 1}.${fileExtension} is empty!`,
    );
    console.log();
    process.exit(1);
  }

  if (learningTrack === 'Python') {
    PythonShell.run(submittedFile, null, (err, result) => {
      if (err) {
        console.log();
        logger.error(' Oops there is something wrong with the syntax part!');
        console.log();
        logger.error(err.toString());
        process.exit(1);
      }

      PythonShell.run(solutionFile, null, (err, solution) => {
        if (err) {
          logger.error(' ' + err.toString());
          process.exit(1);
        }

        if (typeof result === 'undefined' || typeof solution === 'undefined') {
          console.log();
          logger.error(
            ` Please take a look at task${taskCount}.${fileExtension}`,
          );
          process.exit(1);
        }
        validateSolution(submittedFile);
        checkSolution(result, solution, exercises.length);
      });
    });
  } else {
    exec(`node ${submittedFile}`, (err, result) => {
      if (err) {
        logger.error(' Oops there is something wrong with the syntax part!');
        process.exit(1);
      }
      exec(`node ${solutionFile}`, (err, solution) => {
        if (err) throw err;
        validateSolution(submittedFile);
        checkSolution(result, solution, exercises.length);
      });
    });
  }
};

module.exports = submitTask;
