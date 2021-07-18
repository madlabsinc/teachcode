"use strict";

const path = require("path");
const test = require("ava");
const fs = require("fs");

const { createUserConfig, run } = require("../helpers/test-utils");
const fileExtensionMap = require("../../src/utils/constants");

const workspacePath = path.join(__dirname, "..", "..", "src", "workspace");

// All files for testing purpose are generated within the teachcode-solutions directory
const workDir = path.join(__dirname, "teachcode-solutions");

// Path to config.json
const configFilePath = path.join(workDir, "config.json");

const learningTracks = Object.keys(fileExtensionMap);

// Create the teachcode-solutions directory
test.before(() => fs.mkdirSync(workDir));

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

test.serial("no config file in the current path should error", async (t) => {
  const { exitCode, stderr } = await run(["fetchtask"], {
    cwd: workDir,
    reject: false,
  });

  // Assertions
  // Exit code
  t.is(exitCode, 1);

  // Assert for the expected error message
  t.is(stderr.trim(), "Could not find config.json in the current path!");
});

test.serial("supplying an invalid key should error", async (t) => {
  for (const track of learningTracks) {
    // Fetch the corresponding file extension
    const fileExtension = fileExtensionMap[track];

    // Create config.json
    const userConfig = createUserConfig(track, 6);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stderr, stdout } = await run(
      ["fetchtask", "incorrectTestKey"],
      {
        cwd: workDir,
        reject: false,
      }
    );

    // Assertions
    // Exit code
    t.is(exitCode, 1);

    // The file shouldn't be created
    t.false(fs.existsSync(path.join(workDir, `task6.${fileExtension}`)));

    // Displays user name and progress information
    t.false(stdout.includes("User: testConfig"));
    t.false(stdout.includes("Progress: 6/30"));

    // Assert for the expected error message
    t.is(stderr.trim(), "Make sure that you have grabbed the key correctly!");
  }
});

test.serial("should be able to access a completed task", async (t) => {
  for (const track of learningTracks) {
    // Fetch the corresponding file extension
    const fileExtension = fileExtensionMap[track];

    // Create config.json
    const userConfig = createUserConfig(track, 6);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stderr, stdout } = await run(["fetchtask", "testKey2"], {
      cwd: workDir,
    });
    const tasksDir = track !== "Python" ? fileExtension : track.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, "tasks.json"));

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // The file shouldn't be created
    t.false(fs.existsSync(path.join(workDir, `task6.${fileExtension}`)));

    // Assert for the expected error message
    t.is(stderr.trim(), "This task is already completed!");

    // Displays user name and progress information
    t.true(stdout.includes("User: testConfig"));
    t.true(stdout.includes("Progress: 6/30"));

    // Displays the second task
    t.true(stdout.includes(tasks[1].task));
  }
});

test.serial("access the current task with the respective key", async (t) => {
  for (const track of learningTracks) {
    // Fetch the corresponding file extension
    const fileExtension = fileExtensionMap[track];

    // Create config.json
    const userConfig = createUserConfig(track, 6);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stdout } = await run(["fetchtask", "testKey6"], {
      cwd: workDir,
    });
    const tasksDir = track !== "Python" ? fileExtension : track.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, "tasks.json"));

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // Assert for the existence of the solution file
    t.true(fs.existsSync(path.join(workDir, `task6.${fileExtension}`)));

    // This message shouldn't be displayed
    t.false(stdout.trim().includes("This task is already completed"));

    // Displays user name and progress information
    t.true(stdout.includes("User: testConfig"));
    t.true(stdout.includes("Progress: 6/30"));

    // Displays the sixth task
    t.true(stdout.includes(tasks[5].task));
  }
});

test.serial("not supplying a key fetches the next task", async (t) => {
  for (const track of learningTracks) {
    // Fetch the corresponding file extension
    const fileExtension = fileExtensionMap[track];

    // Create config.json
    const userConfig = createUserConfig(track, 6);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stdout } = await run(["fetchtask"], { cwd: workDir });
    const tasksDir = track !== "Python" ? fileExtension : track.toLowerCase();
    const tasks = require(path.join(workspacePath, tasksDir, "tasks.json"));

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // Assert for the existence of the solution file
    t.true(fs.existsSync(path.join(workDir, `task6.${fileExtension}`)));

    // This message shouldn't be displayed
    t.false(stdout.trim().includes("This task is already completed"));

    // Displays user name and progress information
    t.true(stdout.includes("User: testConfig"));
    t.true(stdout.includes("Progress: 6/30"));

    // Displays the sixth task
    t.true(stdout.includes(tasks[5].task));
  }
});

test.serial(
  "displays an appropriate message if no more tasks are available",
  async (t) => {
    for (const track of learningTracks) {
      // Create config.json
      const userConfig = createUserConfig(track, 30);
      fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

      const { exitCode, stderr, stdout } = await run(["fetchtask"], {
        cwd: workDir,
      });

      // Assertions
      // Exit code
      t.is(exitCode, 0);

      // Won't display user name and progress information
      t.false(stdout.includes("User: testConfig"));
      t.false(stdout.includes("Progress"));

      // Assert for the expected message
      t.is(stderr.trim(), "No more tasks available!");
    }
  }
);
