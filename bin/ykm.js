#!/usr/bin/env node
const program = require('commander');
program
  .version(require("../package.json").version)
  .command('init', 'create a project')
  .command('build', 'build this project')

program.parse(process.argv);