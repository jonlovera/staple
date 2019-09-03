#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");

// globals
const config = require("./globals");

// utilities
const loader = require("./utils/loaders");
const shell = require("./utils/shelljs");

// commands
const papers = require("./papers");

const ensureStaple = fn => async (...args) => {
  try {
    const projectDir = config.paths.project;
    const stapleExists = await fs.pathExists(projectDir);

    if (!stapleExists) {
      loader.default.start();
      loader.default.text = "Loading the stapler";

      await fs.ensureDir(projectDir);

      // Initialize package.json if it doesn't exists (-n)
      shell.cp("-rn", path.join(config.paths.staple, "template/*"), projectDir);

      shell.cd(projectDir);
      await shell.exec("npm i --save staple");
      // await shell.exec("npm i --save staple routes-paper");
      loader.default.succeed();
    }

    shell.cd(projectDir);

    return fn(...args);
  } catch (e) {
    loader.default.fail();
    console.log("");
    console.error(e);
  }
};

const argv = require("yargs")
  .usage("Usage: $0 <command> [options]")
  .command(
    "paper [names..]",
    "Add paper to your current directory",
    papers.yargs,
    ensureStaple(papers.add)
  )
  .help("h")
  .alias("h", "help")
  .alias("v", "version").argv;
