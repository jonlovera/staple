#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const delay = require("delay");

// globals
const config = require("./globals");

// utilities
const { delay } = require("../utils");
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

      // @TODO this is only for development purposes only
      if (config.env.development) {
        const lerna = {
          packages: [
            ".",
            path.join(config.paths.staple, "../*"),
            path.join(config.paths.paperPackages, "*")
          ],
          version: "0.0.0"
        };

        await fs.outputFile(
          path.join(projectDir, "lerna.json"),
          JSON.stringify(lerna)
        );
      }
    }

    shell.cd(projectDir);

    if (!stapleExists) {
      if (config.env.development) {
        await shell.exec("lerna add staple .");
        await delay(1000);
        await shell.exec("lerna add routes-paper .");
      } else {
        await shell.exec("npm i");
        await shell.exec("npm i --save staple routes-paper");
      }

      loader.default.succeed();
    }

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
