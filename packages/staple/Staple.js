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

  setup({ sequelize }) {
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
    if (sequelize) {
      this.sequelize = sequelize;

      const getWhere = idOrWhere =>
        typeof idOrWhere === "object" ? idOrWhere : { id: idOrWhere };

      Object.keys(this.models).map(name => {
        const {
          attributes,
          classMethods,
          instanceMethods,
          ...options
        } = this.models[name];

        const Model = sequelize.define(name, attributes, options);

        Object.keys(instanceMethods).map(name => {
          const method = instanceMethods[name];
          Model.prototype[name] = method;
        });

        const actions = {
          // Find one
          retrieve: async idOrWhere =>
            await Model.findOne({ where: getWhere(idOrWhere) }),

          // List all
          list: async where => await Model.findAll({ where }),

          // Create
          create: async params => await Model.create(params),

          // Update
          update: async (idOrWhere, params) =>
            await Model.update(params, { where: getWhere(idOrWhere) }),

          // Destroy
          destroy: async idOrWhere =>
            await Model.destroy({ where: getWhere(idOrWhere) }),

          // Personalized model methods
          ...classMethods
          // sequelize: Model
        };

        this.models[name] = Object.assign(this.models[name], actions);
      });
    }

    // // load database managers
    // if (sequelize) {
    //   this.sequelize = sequelize;
    //   Object.keys(this.models).map(name => {
    //     const { attributes, ...options } = this.models[name];
    //     const model = sequelize.define(name, attributes, options);
    //
    //     // Remove options and keep reference to the object in "this.database.model"
    //     delete this.models.User.attributes;
    //     delete this.models.User.instanceMethods;
    //     delete this.models.User.hooks;
    //
    //     this.models[name] = Object.assign(this.models[name], model);
    //   });
    //
    //   sequelize.sync({ force: true });
    // }

    return this;
  }
}

module.exports = Staple;
