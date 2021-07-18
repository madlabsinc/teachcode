"use strict";

const chalk = require("chalk");
const fs = require("fs");
const showBanner = require("node-banner");

const logger = require("../utils/logger");

/**
 * Shows a list of keys that the user has hold of
 *
 * @returns {Promise<void>}
 */

const showKeys = async () => {
  await showBanner(
    "teachcode",
    ` Learn to code effectively ${`\t`.repeat(4)} Powered by MadHacks`
  );
  console.log();

  if (!fs.existsSync(`./config.json`)) {
    logger.error(" Could not find config.json in the current path!");
    console.log();
    process.exit(1);
  }

  let userConfig = fs.readFileSync("./config.json", "utf8");
  const { keys, userName, taskCount } = JSON.parse(userConfig);

  console.log();
  logger.success(
    `User: ${userName}${`\t`.repeat(6)}Progress: ${taskCount + 1}/30`
  );

  if (keys.length === 0) {
    console.log();
    logger.info(
      `  Looks like this is your very first task. Type in ${chalk.yellow.bold(
        "teachcode fetchtask"
      )} to get started!`
    );
    console.log();
  } else {
    keys.map((key, idx) => {
      console.log();
      logger.success(` Task-${idx + 1}: ${key}`);
    });
  }
};

module.exports = showKeys;
