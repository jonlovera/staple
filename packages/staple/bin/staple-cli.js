#!/usr/bin/env node

// commands
const init = require("./middleware/init");

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  // .command("$0", "the default command", () => {}, ensureStaple)
  .middleware(init)
  .commandDir("commands")
  .help("h")
  .alias("h", "help")
  .alias("v", "version").argv;
