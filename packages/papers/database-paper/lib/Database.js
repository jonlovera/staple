"use strict";

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
