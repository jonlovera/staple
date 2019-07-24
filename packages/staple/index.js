"use strict";

const Staple = require("./Staple");
const { controller } = require("./utils");
const parse = require("urlencoded-body-parser");

module.exports = new Staple();
module.exports.Staple = Staple;
module.exports.controller = controller;
module.exports.parse = parse;
