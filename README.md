[![Build Status](https://travis-ci.com/madlabsinc/teachcode.svg?branch=master)](https://travis-ci.com/madlabsinc/teachcode)
[![npm version](https://badgen.net/npm/v/teach-code)](https://www.npmjs.com/package/teach-code)
[![downloads](https://badgen.net/npm/dm/teach-code)](https://www.npmjs.com/package/teach-code)
[![PRs Welcome](https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg)](https://github.com/madlabsinc/Teach-Code/pull/new)

<p align="center">
  <img src="https://i.imgur.com/BuMZB6C.png" width="240" height="240">
  <h1 align="center">Teach-Code</h1>
</p>

> A tool to develop and improve a student’s programming skills by introducing the earliest lessons of coding.

## Installation

`npm install -g teach-code`

## How to use

The user is provided with 30 tasks guiding them through the basic constructs of a preferred programming language. He/she gets a key to access the next task if the current task meets all the test cases. There is also the provision to revisit previously submitted tasks, but it can't be worked on again.

- Navigate to a directory of your choice and fire in `teach-code init`.
- Navigate to the `Teach-Code-solutions` directory.
- Copy and paste the command as instructed within the initial screen `teach-code fetchtask <key>`.
- Hurray :+1: you've got your first task.
- Write your solution within a file that is auto-created. For instance, `task<task_number>.py` for Python.
- `teach-code submit` submits the current solution and gives you the next key to proceed if your solution meets all the test cases.
- `teach-code showkeys` shows you all the keys. 
- `teach-code showcommands` shows you all the commands available for reference.

## Available Commands

| command | description |                                                                                                
| -------------- |  ---------------- |
| `teach-code init` | Initializes all the tasks |
| `teach-code fetchtask <key>` | Fetches the task correponding to key provided |
| `teach-code submit` | Submits the current task |
| `teach-code showkeys` | Shows all the keys grabbed |
| `teach-code showcommands` | Lists all the available commands |

## Demo

[![asciicast](https://asciinema.org/a/Dt6tL9vo6wAWqhh7nvwEFTMqA.svg)](https://asciinema.org/a/Dt6tL9vo6wAWqhh7nvwEFTMqA)

## License

Licensed under `GNU General Public License V3.0`
