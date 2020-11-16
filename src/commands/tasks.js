'use strict';

const fs = require('fs');
const path = require('path');
const showBanner = require('node-banner');

const logger = require('../utils/logger');

/**
 * Fetch the respective task corresponding to the supplied key
 *
 * @param {String} key - key that corresponds to a task
 * @returns {Promise<void>}
 */

const fetchTask = async key => {
  await showBanner(
    'teachcode',
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`,
  );
  console.log();

  if (!fs.existsSync('./config.json')) {
    logger.error(' Could not find config.json in the current path!');
    console.log();
    logger.info(
      ' Make sure that you are within the teachcode-solutions directory!',
    );
    console.log();
    process.exit(1);
  }

  // Reading the user-config information.
  const userConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

  const {
    learningTrack,
    userName,
    taskCount,
    keys,
    userSubmittedFiles,
  } = userConfig;

  // Holds a reference to the file extensions corresponding to the learning track
  const fileExtensionMap = {
    Python: 'py',
    JavaScript: 'js',
  };

  // For eg: task1.py
  const fileName = `task${taskCount + 1}.${fileExtensionMap[learningTrack]}`;

  const tasksDir =
    learningTrack === 'Python' ? 'python' : fileExtensionMap[learningTrack];
  const exercises = require(path.join(
    __dirname,
    '..',
    'workspace',
    tasksDir,
    'tasks',
  ));

  // Progress information
  const progressInfo = `${Math.min(taskCount + 1, 30)}/${exercises.length}`;

  if (key && !keys.includes(key)) {
    console.log();
    logger.error('Make sure that you have grabbed the key correctly!');
    console.log();
    process.exit(1);
  }

  // Check if no more tasks are available (no key provided)
  if (!key && taskCount === exercises.length) {
    console.log();
    logger.warn(' No more tasks available!');
    process.exit(0);
  }

  // In case no key is provided, fetch the next task
  if (!key) {
    key = keys.slice(-1).pop();
  }

  // Fetch the key position within the user config if it is not the current task
  const taskIdx = keys.slice(0, taskCount).indexOf(key);

  if (taskIdx !== -1) {
    console.log();
    logger.warn(' This task is already completed!');

    console.log();
    console.log();

    // Display user name and progress information
    logger.success(
      `User: ${userName}${`\t`.repeat(4)}Progress: ${progressInfo}`,
    );
    console.log();

    // Display the task corresponding to the key supplied
    logger.success(exercises[taskIdx].task);
    console.log();
    return;
  }

  // Grab the key corresponding to the most recent task
  if (keys.slice(-1).pop() === key) {
    if (!userSubmittedFiles.includes(fileName)) {
      userSubmittedFiles.push(fileName);
    }

    // Write back the updated config
    fs.writeFileSync('./config.json', JSON.stringify(userConfig, null, 2));

    // Display user name and progress information
    console.log();
    logger.success(
      `User: ${userName}${`\t`.repeat(6)}Progress: ${progressInfo}`,
    );

    // Display the task
    console.log();
    logger.success(exercises[taskCount].task);
    console.log();

    // Create a solution file corresponding to the current task
    fs.writeFileSync(fileName, `// Write your solution in this file`);
  }
};

module.exports = fetchTask;
