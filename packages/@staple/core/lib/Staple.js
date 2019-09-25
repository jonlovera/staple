"use strict";

const path = require("path");
const chalk = require("chalk");

//
// Classes
//
const Booklet = require("./Booklet");

//
// Utilities
//
const { controller, paths, getter, bindAll } = require("./utils");

class Staple {
  constructor() {}

  async setup(options = {}) {
    if (!options.papers) options.papers = {};

    const staple = this;
    const booklet = new Booklet();
    staple.booklet = { papers: booklet.papers, find: booklet.find };

    const pkg = require(paths.app("package.json"));
    booklet.registerPapers(pkg.dependencies);

    const pluginsHelpers = {};

    await booklet.order.nodes.reduce(async (previousPromise, name) => {
      await previousPromise;

      const paper = booklet.find(name);

      //
      // Load app papers configurations
      //
      const config = options.papers[name] || {};
      paper.config = {
        ...config,
        get: getter
      };

      //
      // Helpers that are passed to each paper
      //
      const helpers = {
        ...bindAll(paper, pluginsHelpers),
        staple,
        booklet,
        controller,
        paths,
        registerHelper: (name, fn) => (pluginsHelpers[name] = fn)
      };

      //
      // Initialize the module (paper)
      //
      if (typeof paper.setup === "function") {
        staple[name] = await paper.setup.bind(paper)(helpers);
      } else {
        staple[name] = paper.setup;
      }

      if (!staple[name]) delete staple[name];

      // console.log(`Loaded ${name} paper`);
    }, Promise.resolve());

    console.log(`${chalk.gray("┌┐")} Staple is running`);

    return staple;
  }
}

module.exports = Staple;
