const dot = require("dot-object");

module.exports = function(value) {
  // Remove get function from it to avoid calling get again
  const { get, ...options } = this;
  if (value) return dot.pick(value, options);
  return options;
};
