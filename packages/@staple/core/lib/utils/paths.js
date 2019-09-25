const path = require("path");

module.exports = {
  app: (...args) => {
    return path.join(process.cwd(), ...args);
  },
  nodeModule: (...args) => path.join(process.cwd(), "node_modules", ...args)
};
