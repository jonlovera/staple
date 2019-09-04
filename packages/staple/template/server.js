const staple = require("staple");
const express = require("express");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/staple-with-sequelize"
);
staple.setup({ sequelize });

const app = express();

app.use(staple.routes);

sequelize.sync();

app.listen(4000);
