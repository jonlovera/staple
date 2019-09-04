const ora = require("ora");

module.exports.default = ora({
  spinner: {
    interval: 200,
    frames: [".  ", ".. ", "...", " ..", "  .", "   "]
  }
});

module.exports.stapling = ora({
  spinner: {
    interval: 230,
    frames: ["┌┐", "__", "┌┐", "┌┐", "┌┐"]
  }
});
