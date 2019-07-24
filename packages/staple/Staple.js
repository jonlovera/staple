"use strict";

const merge = require("merge-deep");
const { controller, appPath } = require("./utils");

class Staple {
  constructor() {
    this.models = {};
    this.database = {
      model: (name, options) => {
        const model = this.models[name];

        if (typeof options === "object")
          this.models[name] = merge(model, options);

        return this.models[name];
      }
    };
  }

  setup(options) {
    console.clear();

    const staple = this;
    const pkg = require(appPath("package.json"));
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

    Object.keys(dependencies).map(moduleName => {
      if (moduleName.indexOf("staple-") === 0) {
        const name = moduleName.replace("staple-", "");

        if (!staple[name]) {
          const module = require(appPath(`node_modules/${moduleName}`));

          const helpers = { controller, database: this.database };

          staple[name] = module(helpers);
        }
      }
    });

    // load database managers
    if (options.sequelize) require("./database/sequelize").bind(this)(options);

    return this;
  }
}

module.exports = Staple;
