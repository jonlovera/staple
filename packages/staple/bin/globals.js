const path = require("path");

const paths = {};
paths.current = process.cwd();
paths.staple = path.join(__dirname, "..");
paths.project = path.join(paths.current, "staple");

// @TODO this is only for development purpose only
paths.paperPackages = path.join(paths.staple, "../papers");
paths.package = paths.staple;

module.exports.paths = paths;

require("dotenv").config({ path: path.join(paths.staple, ".env") });

module.exports.env = {
  development: process.env.STAPLE_CLI_DEVELOPMENT || false
};
