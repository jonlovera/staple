const ora = require("ora");

module.exports.default = ora();
module.exports.stapling = ora({
  spinner: {
    interval: 230,
    frames: ["┌┐", "__", "┌┐", "┌┐", "┌┐"]
  }
});
