"use strict";

const dot = require("dot-object");
const merge = require("merge-deep");
const { controller, appPath } = require("./utils");

const getter = function(value) {
  // Remove get function from it to avoid calling get again
  const { get, ...options } = this;
  if (value) return dot.pick(value, options);
  return options;
};

class Staple {
  constructor() {
    this.models = {};
    this.booklet = {};
  }

  setup(options = {}) {
    console.clear();

    const staple = this;
    const pkg = require(appPath("package.json"));
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

    //
    // Load app papers configurations
    //
    const papers = options.papers || {};

    Object.keys(dependencies).map(pkgName => {
      if (pkgName.indexOf("-paper") > -1) {
        const paperName = pkgName.replace("-paper", "");

        if (!staple[paperName]) {
          const module = require(appPath(`node_modules/${pkgName}`));

          const config = papers[paperName] || {};

          //
          // Add information to the list of papers
          // to keep them organized
          //
          this.booklet[paperName] = {
            name: pkgName,
            config: {
              ...config,
              // get(value) {
              //   // Remove get function from it to avoid calling get again
              //   const { get, ...options } = this;
              //   if (value) return dot.pick(value, options);
              //   return options;
              // }
              get: getter
            }
          };

          const booklet = {
            current: this.booklet[paperName],
            find: getter,
            ...this.booklet
          };

          //
          // Define database helpers
          //
          const database = {
            model: (name, options) => {
              const model = this.models[name];

              if (typeof options === "object") {
                this.models[name] = {
                  ...merge(model, options),

                  // General configurations
                  staple,

                  // add extra helper so models can access
                  // the current paper configurations
                  booklet
                };
              }

              return this.models[name];
            }
          };

          //
          // Helpers that are passed to each paper
          //
          const helpers = {
            booklet,
            database,
            controller
          };

          //
          // Initialize the module (paper)
          //
          staple[paperName] = module(helpers);
        }
      }
    });

    //
    // Load database managers
    //
    if (options.sequelize) require("./database/sequelize").bind(this)(options);

    return this;
  }
}

module.exports = Staple;
