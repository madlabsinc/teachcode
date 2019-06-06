# teachcode

> Learn to code effectively.

## How it works

The user is required to solve 30 tasks which takes him/her through the basic constructs of a programming language of choice. The tasks are such that the complexity goes on increasing based on the user progress. Also, he/she can't move forward unless the current task is completed since the progress is governed by a unique key that gets generated on successful completion. Previously submitted tasks can be viewed as required by the user but can't be worked on again.

- It expects you to have a GitHub account. Make sure that you create one if that's not the case.
- Navigate to a directory of your choice and type in `teachcode init`.
- Follow the instructions as being prompted.
- Now type in `cd teachcode-solutions`.
- Grab the initial key and type in `teachcode fetchtask {key}`.
- Hurray :tada: you've got your first task.
- Now you can find a `config.json` and `task1.py` (language of choice) file within the `teachcode-solutions` directory.
- Open up your favourite editor and code up the solution.
- Now type in `teachcode submit`.
- Enter your Git credentials when prompted.
- If the current solution satisfies all test cases, you'll get the key to proceed with.
- Grab the key and type in `teachcode fetchtask {key}`.