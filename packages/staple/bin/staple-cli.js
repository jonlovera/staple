#!/usr/bin/env node

// commands
const papers = require("./papers");

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command(
    "paper [names..]",
    "Add paper to your current directory",
    papers.yargs,
    papers.add
  )
  .help("h")
  .alias("h", "help")
  .alias("v", "version").argv;
