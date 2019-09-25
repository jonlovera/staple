const BaseResource = require("../BaseResource");
const { parseWhere } = require("../utils");

class MongooseResource extends BaseResource {
  constructor(config) {
    super(config);
    const { mongoose } = config;

    const {
      attributes = {},
      classMethods = {},
      instanceMethods = {},
      ...options
    } = this.model;

    const instance = new mongoose.Schema(attributes, options);

    this.model = sequelize.define(this.name, attributes, options);

    Object.keys(instanceMethods).map(name => {
      const method = instanceMethods[name];
      instance.method(name, method);
    });

    Object.keys(classMethods).forEach(name => {
      const method = classMethods[name];
      instance.static(name, method);
    });

    // @TODO add hooks support
  }

  //
  // Find one
  //
  async retrieve(where, opts) {
    const { expand = "", ...options } = opts || {};

    // if the where is an string then is an id
    if (typeof where === "string")
      return await this.model.findById(where, options).populate(expand);

    return await this.model.findOne(where, options).populate(expand);
  }

  //
  // List all
  //
  async list(where, opts) {
    const { page = 1, limit = 10, expand = "", ...where } = opts || {};

    //
    // default options
    //
    const options = { limit };
    options.skip = page > 1 ? options.skip * options.limit : 0;

    const data = await this.model.find(where, null, options).populate(expand);

    let count = 0;
    if (data.length) {
      count = where
        ? await this.model.countDocuments(where)
        : await this.model.estimatedDocumentCount();
    }

    return {
      data,
      pagination: { page, total: Math.ceil(count / options.limit) }
    };
  }

  //
  // Create
  //
  async create(body, opts) {
    const { expand = "", ...options } = opts || {};
    let entity;

    try {
      entity = await this.model.create(body);
    } catch (e) {
      handleError(e);
    }

    if (entity && expand)
      entity = await this.model.findById(entity.id, options).populate(expand);

    return entity;
  }

  //
  // Update
  //
  async update(where, body, options) {
    const { expand = "", ...options } = opts || {};
    let entity = await this.model.findById(id, options);

    Object.keys(body)
      .filter(key => key in entity)
      .forEach(key => (entity[key] = body[key]));

    try {
      entity = await entity.save();
    } catch (e) {
      handleError(e);
    }

    if (expand) return await this.model.findById(id, options).populate(expand);

    return entity;
  }

  //
  // Destroy
  //
  async destroy(where, options) {
    // if the where is an string then is an id
    if (typeof where === "string")
      return await this.model.findByIdAndDelete(where, options);

    // return await this.model.findOne(where, options).populate(expand);
  }
}

module.exports = MongooseResource;
