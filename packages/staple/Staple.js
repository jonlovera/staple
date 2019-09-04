"use strict";

const path = require("path");
const dot = require("dot-object");
const merge = require("merge-deep");
const paramCase = require("param-case");

// utilities
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

    const paperDependencies = Object.keys(dependencies).filter(
      dependency => dependency.indexOf("-paper") > -1
    );

    // @TODO add option for plugins to load last
    paperDependencies.push(
      paperDependencies.splice(paperDependencies.indexOf("routes-paper"), 1)[0]
    );

    paperDependencies.map(pkgName => {
      if (pkgName.indexOf("-paper") > -1) {
        const paperName = pkgName.replace("-paper", "");

        if (!staple[paperName]) {
          const paperPath = appPath(`node_modules/${pkgName}`);
          const module = require(paperPath);

          const config = papers[paperName] || {};
          //
          // Add information to the list of papers
          // to keep them organized
          //
          this.booklet[paperName] = {
            name: pkgName,
            path: paperPath,
            routes: [],
            config: {
              ...config,
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
          // Define all the routes and extract it's information
          // like path, method and controller
          //
          let count = 0;
          const route = options => {
            const ctrl =
              typeof options === "function"
                ? controller(options)
                : controller(options.controller);

            this.booklet[paperName];

            const index = count;

            setTimeout(() => {
              if (typeof options === "object") {
                const actions = Object.keys(staple[paperName]);
                const route = path.join(
                  "/api",
                  paperName,
                  options.path || paramCase(actions[index])
                );
                const method = (options.method || "get").toUpperCase();

                this.booklet[paperName].routes.push({
                  path: options.fullPath || route,
                  method: method,
                  controller: ctrl
                });
              }
            });

            count++;
            return ctrl;
          };

          //
          // Helpers that are passed to each paper
          //
          const helpers = {
            staple,
            booklet,
            database,
            route,
            controller,
            appPath
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
