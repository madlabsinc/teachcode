const execa = require('execa');
const { join } = require('path');

const CLI_PATH = join(__dirname, '..', '..', 'bin');

const run = (args, options) => execa('node', [CLI_PATH].concat(args), options);

module.exports = run;
