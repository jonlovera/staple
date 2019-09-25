const fs = require("fs-extra");
const sh = require("shelljs");
const glob = require("glob-promise");

//
// Classes
//
const Database = require("./Database");

module.exports = async function setup({ paths, registerHelper }) {
  const sequelize = this.config.get("sequelize");
  const mongoose = this.config.get("mongoose");

  const database = new Database({ sequelize, mongoose });
  await database.setup({ modelsPath: paths.app("models") });
  registerHelper("database", database);
  // return { database };
};
