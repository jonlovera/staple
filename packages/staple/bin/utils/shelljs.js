const shell = require("shelljs");

module.exports = {
  ...shell,
  exec: async (command, options) => {
    if (!options) options = { silent: true };

    return new Promise((resolve, reject) => {
      return shell.exec(command, options, (code, stdout, stderr) => {
        if (stdout || code === 0) return resolve(stdout);
        return reject(stderr);
      });
    });
  }
};
