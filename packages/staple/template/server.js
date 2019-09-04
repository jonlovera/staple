const staple = require("staple");
const express = require("express");
const Sequelize = require("sequelize");
const { name } = require("./package.json");

const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/${name || "staple-app"}`
);
staple.setup({ sequelize });

const app = express();

app.use(staple.routes);

sequelize.sync();

app.listen(4000);
