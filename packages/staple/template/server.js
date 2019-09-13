const staple = require("staple");
const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  `postgres://postgres:postgres@localhost:5432/staple-app`
);
staple.setup({ sequelize });

const app = express();
app.use(cors());

app.use(staple.routes);

sequelize.sync();

app.listen(4000);
