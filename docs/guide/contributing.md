---
title: 'Contributing'
---

# Contributing

## Guidelines

1. Fork and clone the repository.
2. Navigate to the project directory.
3. Now install the dependencies with `npm install`
4. Type in `npm link` which creates a symlink and thereby allowing `teachcode` to be accessed globally.
5. Make your life changing changes.
6. Ensure that your code is free from linting errors and is as per prettier conventions by typing in `npm run lint`.
7. We use [commitlint conventional naming rules](https://www.npmjs.com/package/@commitlint/config-conventional#rules) for our commits, make sure that you follow them.
8. Now you may push it to the remote repository by switching over to another branch and finally proposing a Pull Request to the base fork.


## Points to ponder

1. Make sure that you submit an issue first if you have something in mind that you're willing to work on.
2. Follow a `rebase` strategy to update your remote branch with the latest changes.
3. Prefix your branch names with `feat/`, `docs/` or `hotfix/` for feature proposals, docs-related and bug fixes, respectively.
