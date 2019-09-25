#!/usr/bin/env node

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .commandDir("commands")
  .help("h")
  .alias("h", "help")
  .alias("v", "version").argv;
