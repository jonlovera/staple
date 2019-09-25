const path = require("path");

module.exports = {
  cwd: (...args) => path.join(process.cwd(), ...args),
  app: (...args) => path.join(process.cwd(), "src", ...args),
  nodeModule: (...args) => path.join(process.cwd(), "node_modules", ...args)
};
