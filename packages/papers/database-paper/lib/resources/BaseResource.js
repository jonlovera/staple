const { NotImplementedError } = require("./errors");

class BaseResource {
  constructor({ name, model }) {
    this.name = name;
    this.model = model;

    const { classMethods = {} } = this.model;

    Object.keys(classMethods).map(name => {
      const method = classMethods[name];
      this.prototype[name] = method;
    });
  }

  //
  // Find one
  //
  retrieve(idOrWhere) {
    throw new NotImplementedError("BaseResource.retrieve");
  }

  //
  // List all
  //
  list(where) {
    throw new NotImplementedError("BaseResource.list");
  }

  //
  // Create
  //
  create(params) {
    throw new NotImplementedError("BaseResource.create");
  }

  //
  // Update
  //
  update(idOrWhere) {
    throw new NotImplementedError("BaseResource.update");
  }

  //
  // Destroy
  //
  destroy(idOrWhere) {
    throw new NotImplementedError("BaseResource.destroy");
  }
}

module.exports = BaseResource;
