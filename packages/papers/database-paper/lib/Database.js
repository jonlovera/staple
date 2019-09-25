"use strict";
const path = require("path");
const glob = require("glob-promise");

const SequelizeResource = require("./resources/adapters/SequelizeResource");
// const MongooseResource = require("./resources/adapters/MongooseResource");

class Database {
  constructor(options = {}) {
    const { mongoose, sequelize } = options;

    this.dbType = sequelize ? "sequelize" : mongoose ? "mongoose" : null;
    this.models = {};

    if (this.dbType === "sequelize") {
      this.sequelize = sequelize;
    } else if (this.dbType === "mongoose") {
      this.mongoose = mongoose;
    }
  }

  async setup({ modelsPath }) {
    const files = await glob(path.join(modelsPath, "**/*.js"));
    files.map(file => {
      const name = path.basename(file, path.extname(file));
      const model = require(file);
      this.model(name, model);
    });
  }

  model(name, model) {
    if (model) {
      if (this.dbType === "sequelize") {
        this.models[name] = new SequelizeResource({
          name,
          model,
          sequelize: this.sequelize
        });
      }
    }

    return this.models[name];
  }
}

module.exports = Database;
