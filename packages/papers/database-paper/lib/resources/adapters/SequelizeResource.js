const BaseResource = require("../BaseResource");
const { parseWhere } = require("../utils");

class SequelizeResource extends BaseResource {
  constructor(config) {
    super(config);
    const { sequelize } = config;

    const {
      attributes = {},
      classMethods = {},
      instanceMethods = {},
      ...options
    } = this.model;

    this.model = sequelize.define(this.name, attributes, options);

    Object.keys(instanceMethods).map(name => {
      const method = instanceMethods[name];
      this.model.prototype[name] = method;
    });
  }

  //
  // Find one
  //
  async retrieve(idOrWhere) {
    return await this.model.findOne({ where: parseWhere(idOrWhere) });
  }

  //
  // List all
  //
  async list(where) {
    return await this.model.findAll({ where });
  }

  //
  // Create
  //
  async create(params) {
    return await this.model.create(params);
  }

  //
  // Update
  //
  async update(idOrWhere) {
    return await this.model.update(params, { where: parseWhere(idOrWhere) });
  }

  //
  // Destroy
  //
  async destroy(idOrWhere) {
    return await this.model.destroy({ where: parseWhere(idOrWhere) });
  }
}

module.exports = SequelizeResource;
