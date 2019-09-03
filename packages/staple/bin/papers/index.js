const add = require("./add");

module.exports = {
  yargs: yargs => {
    yargs
      .positional("names", {
        describe: "names of papers to install",
        default: []
      })
      .required(["names"]);
  },
  add
};
