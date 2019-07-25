"use strict";

const dot = require("dot-object");
const merge = require("merge-deep");
const { controller, appPath } = require("./utils");

class Staple {
  constructor() {
    this.models = {};
    this.papers = {};
  }

  setup(options) {
    console.clear();

    const staple = this;
    const pkg = require(appPath("package.json"));
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

    // load papers configurations
    const papers = options.papers || {};

    Object.keys(dependencies).map(pkgName => {
      if (pkgName.indexOf("staple-") === 0) {
        const paperName = pkgName.replace("staple-", "");

        if (!staple[paperName]) {
          const module = require(appPath(`node_modules/${pkgName}`));

          const config = papers[paperName] || {};

          this.papers[paperName] = {
            name: pkgName,
            config,
            getConfig(value) {
              return dot.pick(value, this.config);
            }
          };

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
                  getCurrentPaper(value) {
                    const paper = this.staple.papers[paperName];
                    if (value) return dot.pick(value, paper);
                    return paper;
                  }
                };
              }

              return this.models[name];
            }
          };

          const helpers = {
            paper: this.papers[paperName],
            database,
            controller
          };

          staple[paperName] = module(helpers);
        }
      }
    });

    // load database managers
    if (options.sequelize) require("./database/sequelize").bind(this)(options);

    return this;
  }
}

module.exports = Staple;
