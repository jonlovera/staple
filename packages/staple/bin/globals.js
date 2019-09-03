const path = require("path");

const paths = {};
paths.current = process.cwd();
paths.staple = path.join(__dirname, "..");
paths.project = path.join(paths.current, "staple");

module.exports.paths = paths;
