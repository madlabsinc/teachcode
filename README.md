<p align="center">
  <a href="https://teachcode.madhacks.co"><img src="https://i.imgur.com/BuMZB6C.png" width="240" height="240"></a>
  <h1 align="center">teachcode</h1>
</p>

<p align="center">
	<a href=""https://travis-ci.com/madlabsinc/teachcode><img src="https://travis-ci.com/madlabsinc/teachcode.svg?branch=master" alt="Build Status" /></a>
	<a href="https://www.npmjs.com/package/teach-code"><img src="https://badgen.net/npm/v/teach-code" alt="npm version" /></a>
	<a href="https://www.npmjs.com/package/teach-code"><img src="https://badgen.net/npm/dm/teach-code" alt="Downloads" /></a>
	<a href="https://github.com/madlabsinc/teachcode/pull/new"><img src="https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
	<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="code style: prettier" /></a>
	<a href="https://github.com/ulivz/awesome-vuepress"><img src="https://awesome.re/mentioned-badge.svg" alt="Mentioned in Awesome-VuePress" /></a>
</p>


> A tool to develop and improve a student’s programming skills by introducing the earliest lessons of coding.

## Installation

`npm install -g teach-code`

## How to use

The user is required to solve 30 tasks which takes him/her through the basic constructs of a programming language of choice. The tasks are such that the complexity goes on increasing based on the user progress. Also, he/she can't move forward unless the current task is completed since the progress is governed by a unique key that gets generated on successful completion. Previously submitted tasks can be viewed as required by the user but can't be worked on again.

- It expects you to have a GitHub account. Make sure that you create one if that's not the case.
- Navigate to a directory of your choice and type in `teachcode init`.
- Follow the instructions as being prompted.
- Now type in `cd teachcode-solutions`.
- Grab the initial key and type in `teachcode fetchtask <key>`.
- Hurray :tada: you've got your first task.
- Now you can find a `config.json` and `task1.py` (language of choice) file within the `teachcode-solutions` directory.
- Open up your favourite editor and code up the solution.
- Now type in `teachcode submit`.
- Enter your Git credentials when prompted.
- If the current solution satisfies all test cases, you'll get the key to proceed with.
- Grab the key and type in `teachcode fetchtask <key>`.

## Available Commands

| command | description |                                                                                                
| -------------- |  ---------------- |
| teachcode init | Initializes all the tasks |
| teachcode fetchtask <key> | Fetches the task correponding to key provided |
| teachcode submit | Submits the current task |
| teachcode showkeys | Shows all the keys grabbed |
| teachcode showcommands | Lists all the available commands |

## Contributing

Contributions of any kind are welcomed. Make sure that you go through these [guidelines](https://teachcode.madhacks.co/guide/contributing.html#guidelines)

## License

Licensed under `GNU General Public License V3.0`
