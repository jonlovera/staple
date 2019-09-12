const sh = require("shelljs");

module.exports = {
  ...sh,
  exec: async (command, options) => {
    if (!options) options = { silent: true };

    return new Promise((resolve, reject) => {
      return sh.exec(command, options, (code, stdout, stderr) => {
        if (stdout || code === 0) return resolve(stdout);
        return reject(stderr);
      });
    });
  }
};
