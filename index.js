#!/usr/bin/env node
"use strict";

var program = require("commander");
var package = require('./package.json');

var cloneAction = require("./utils").cloneAction;

program
  .version(package.version)
  .description("Allows to clone gitlbal structure")
  .command("clone")
  .option("--host [host]", "GitLab host", "https://gitlab.com")
  .option(
    "--token <token>",
    "GitLab access token (you can generate it in your profile)"
  )
  .option(
    "--ssh",
    "Use ssh for cloning (http(s) by default) !!!NOT SUPPORTED YET",
    true
  )
  .option("--filter [filter]", "Filter to get repos", "")
  .option("--delay [delay]", "Delay between clone calls", 0)
  .parse(process.argv)
  .action(cloneAction);
program.parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
