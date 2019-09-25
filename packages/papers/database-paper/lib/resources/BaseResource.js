const { NotImplementedError } = require("./errors");

class BaseResource {
  constructor({ name, model }) {
    this.name = name;
    this.model = model;
  }

  //
  // Find one
  //
  retrieve(where, options) {
    throw new NotImplementedError("BaseResource.retrieve");
  }

  //
  // List all
  //
  list(options) {
    throw new NotImplementedError("BaseResource.list");
  }

  //
  // Create
  //
  create(body, options) {
    throw new NotImplementedError("BaseResource.create");
  }

  //
  // Update
  //
  update(where, body, options) {
    throw new NotImplementedError("BaseResource.update");
  }

  //
  // Destroy
  //
  destroy(where, options) {
    throw new NotImplementedError("BaseResource.destroy");
  }
}

module.exports = BaseResource;
