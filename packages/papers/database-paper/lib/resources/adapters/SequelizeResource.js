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

    Object.keys(classMethods).map(name => {
      const method = classMethods[name];
      this.prototype[name] = method;
    });
  }

  //
  // Find one
  //
  async retrieve(where, options) {
    return await this.model.findOne({ where: parseWhere(where) });
  }

  //
  // List all
  //
  async list(where, options) {
    return await this.model.findAll({ where });
  }

  //
  // Create
  //
  async create(body, options) {
    return await this.model.create(body);
  }

  //
  // Update
  //
  async update(where, body, options) {
    return await this.model.update(body, { where: parseWhere(where) });
  }

  //
  // Destroy
  //
  async destroy(where, options) {
    return await this.model.destroy({ where: parseWhere(where) });
  }
}

module.exports = SequelizeResource;
