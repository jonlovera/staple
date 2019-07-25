const { parseWhere } = require("./utils");

module.exports = function({ sequelize, papers }) {
  this.sequelize = sequelize;

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
        await Model.findOne({ where: parseWhere(idOrWhere) }),

      // List all
      list: async where => await Model.findAll({ where }),

      // Create
      create: async params => await Model.create(params),

      // Update
      update: async (idOrWhere, params) =>
        await Model.update(params, { where: parseWhere(idOrWhere) }),

      // Destroy
      destroy: async idOrWhere =>
        await Model.destroy({ where: parseWhere(idOrWhere) }),

      // Personalized model methods
      ...classMethods
    };

    this.models[name] = Object.assign(this.models[name], actions);
  });
};
