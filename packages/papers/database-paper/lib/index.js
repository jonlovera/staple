const path = require("path");
const merge = require("deepmerge");
const glob = require("glob-promise");

//
// Classes
//
const Database = require("./Database");

module.exports = async function setup({ booklet, paths, registerHelper }) {
  const sequelize = this.config.get("sequelize");
  const mongoose = this.config.get("mongoose");

  const database = new Database({ sequelize, mongoose });

  //
  // Load all the models from all the papers and all the models app folder
  //
  const models = {};

  await Promise.all(
    booklet.order.nodes.map(async name => {
      const { dbType } = database;
      const p = paths.nodeModule(`${name}-paper`, `models/*.${dbType}.js`);

      const files = await glob(p);
      files.map(file => {
        const name = path
          .basename(file, path.extname(file))
          .replace(`.${dbType}`, "");
        const model = require(file);

        if (models[name]) models[name] = merge(models[name], model);
        else models[name] = model;
      });
    })
  );

  const files = await glob(paths.app("models", "*.js"));
  files.map(file => {
    const name = path.basename(file, path.extname(file));
    const model = require(file);

    if (models[name]) models[name] = merge(models[name], model);
    else models[name] = model;
  });

  //
  // Mount all models to the database
  //
  Object.keys(models).map(name => database.model(name, models[name]));

  //
  // Register helper for other plugins to use
  //
  registerHelper("database", database);
  // return { database };
};
