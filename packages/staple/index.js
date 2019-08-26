"use strict";

const Staple = require("./Staple");
const { controller } = require("./utils");

module.exports = new Staple();
module.exports.Staple = Staple;
module.exports.controller = controller;
