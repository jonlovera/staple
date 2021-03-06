const path = require("path");

// config
const config = require("../globals");

// utilities
const { delay } = require("../utils");
const loader = require("../utils/loaders");
const { exec } = require("../utils/shelljs");

exports.command = "paper [names..]";
exports.desc = "Add a paper to your current directory";
exports.builder = function(yargs) {
  return yargs
    .positional("names", {
      describe: "names of papers to install",
      default: []
    })
    .required(["names"]);
  // .commandDir("remote_cmds");
};

exports.handler = async args => {
  const packages = args.names.map(name => `${name}-paper`);

  loader.stapling.start();
  loader.stapling.text = "Stapling papers";
  // loader.default.start();
  // loader.default.text = "Installing npm packages";
  try {
    // @TODO this is only for development purposes only
    if (config.env.development) {
      await Promise.all(
        packages.map(async (pkg, i) => {
          await delay(1000 * i);
          await exec(`lerna add ${pkg} .`);
        })
      );
    } else {
      await exec(`npm i --save ${packages.join(" ")}`);
    }

    loader.stapling.succeed();
  } catch (e) {
    loader.stapling.fail();
    console.log("");
    console.error(e);
  }
};
