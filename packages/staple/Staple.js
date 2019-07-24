"use strict";

const { controller, appPath } = require("./utils");

class Staple {
  constructor() {
    this.database = {
      model: (name, options) => `model ${name}`,
      retrieve: id => `retrieve ${id}`,
      list: () => "list",
      create: params => "create",
      update: (id, params) => `update ${id}`,
      destroy: id => `destroy ${id}`
    };
  }

  setup({ sequelize }) {
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
    if (sequelize) {
      this.sequelize = sequelize;
      this.database.model = sequelize.model;
    }

    return this;
  }
}

module.exports = Staple;
