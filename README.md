[![Build Status](https://travis-ci.com/madlabsinc/teachcode.svg?branch=master)](https://travis-ci.com/madlabsinc/teachcode)
[![npm version](https://badgen.net/npm/v/teach-code)](https://www.npmjs.com/package/teach-code)
[![downloads](https://badgen.net/npm/dm/teach-code)](https://www.npmjs.com/package/teach-code)
[![PRs Welcome](https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg)](https://github.com/madlabsinc/Teach-Code/pull/new)

<p align="center">
  <img src="https://i.imgur.com/BuMZB6C.png" width="240" height="240">
  <h1 align="center">teachcode</h1>
</p>

> A tool to develop and improve a student’s programming skills by introducing the earliest lessons of coding.

## Installation

`npm install -g teach-code`

## How to use

The user is provided with 30 tasks guiding them through the basic constructs of a preferred programming language. He/she gets a key to access the next task if the current task meets all the test cases. There is also the provision to revisit previously submitted tasks, but it can't be worked on again.

- Navigate to a directory of your choice and fire in `teachcode init`.
- Navigate to the `teachcode-solutions` directory.
- Copy and paste the command as instructed within the initial screen `teachcode fetchtask <key>`.
- Hurray :+1: you've got your first task.
- Write your solution within a file that is auto-created. For instance, `task<task_number>.py` for Python.
- `teachcode submit` submits the current solution and gives you the next key to proceed if your solution meets all the test cases.
- `teachcode showkeys` shows you all the keys.
- `teachcode showcommands` shows you all the commands available for reference.

## Available Commands

| command | description |                                                                                                
| -------------- |  ---------------- |
| teachcode init | Initializes all the tasks |
| teachcode fetchtask <key> | Fetches the task correponding to key provided |
| teachcode submit | Submits the current task |
| teachcode showkeys | Shows all the keys grabbed |
| teachcode showcommands | Lists all the available commands |

## Contributing

Contributions of any kind are warm welcome. Make sure that you go through these [guidelines](https://teachcode.surge.sh/guide/contributing.html#guidelines)

## License

Licensed under `GNU General Public License V3.0`
