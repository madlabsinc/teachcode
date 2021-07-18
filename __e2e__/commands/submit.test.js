"use strict";

const path = require("path");
const test = require("ava");
const fs = require("fs");

// const workspacePath = path.join(__dirname, '..', '..', 'src', 'workspace');

const { createUserConfig, run } = require("../helpers/test-utils");

// All files for testing purpose are generated within the teachcode-solutions directory
const workDir = path.join(__dirname, "teachcode-solutions");

// Path to config.json
const configFilePath = path.join(workDir, "config.json");

// Create the teachcode-solutions directory
test.before(() => fs.mkdirSync(workDir));

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

test.serial("no config file in the current path should error", async (t) => {
  const { exitCode, stderr } = await run(["submit"], {
    cwd: workDir,
    reject: false,
  });

  // Assertions
  // Exit code
  t.is(exitCode, 1);

  // Assert for the expected error message
  t.is(stderr.trim(), "Could not find config.json in the current path!");
});

test.serial(
  "displays an appropriate message if the user is just starting out",
  async (t) => {
    // Create config.json
    const userConfig = createUserConfig("Python", 0, true);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stdout } = await run(["submit"], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // Assert for the expected error message
    t.true(
      stdout.includes(
        "Please use teachcode fetchtask to fetch your very first task"
      )
    );
  }
);

test.serial(
  "displays an error message if an empty file is submitted",
  async (t) => {
    // Create config.json
    const userConfig = createUserConfig("Python", 6, true);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const fileName = "task6.py";
    fs.writeFileSync(path.join(workDir, fileName), "");

    const { exitCode, stderr } = await run(["submit"], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 1);

    // Assert for the expected error message
    t.is(stderr.trim(), `The file ${fileName} is empty!`);
  }
);

test.serial(
  "displays an error message if the expected constructs are not used",
  async (t) => {
    // Create config.json
    const userConfig = createUserConfig("Python", 3, true);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const fileName = "task3.py";
    fs.writeFileSync(path.join(workDir, fileName), `print('HELLO WORLD')\n11`);

    const { exitCode, stderr } = await run(["submit"], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 1);

    // Assert for the expected error message
    t.is(
      stderr.trim(),
      "Please make sure that you use the required constructs as provided"
    );
  }
);

test.serial(
  "displays an error message if there is an issue with the syntax for the submitted file",
  async (t) => {
    // Create config.json
    const userConfig = createUserConfig("Python", 3, true);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const fileName = "task3.py";
    fs.writeFileSync(path.join(workDir, fileName), `//`);

    const { exitCode, stderr } = await run(["submit"], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 1);

    // Assert for the expected error message
    t.true(
      stderr.includes("Oops, there is something wrong with the syntax part!")
    );
  }
);

test.serial(
  "displays an appropriate message if all the tasks are completed",
  async (t) => {
    // Create config.json
    const userConfig = createUserConfig("Python", 30, true);
    fs.writeFileSync(configFilePath, JSON.stringify(userConfig, null, 2));

    const { exitCode, stdout } = await run(["submit"], {
      cwd: workDir,
      reject: false,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // Assert for the expected error message
    t.true(stdout.trim().includes("All tasks are completed"));
  }
);
