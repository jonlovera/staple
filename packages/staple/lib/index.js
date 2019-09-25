"use strict";

const path = require("path");

const nodeModulePath = (...args) => {
  return path.join(process.cwd(), "node_modules", ...args);
};

module.exports = require(nodeModulePath("@staple/core"));
