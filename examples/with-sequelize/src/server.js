const express = require("express");
const staple = require("staple");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/staple-with-sequelize"
);

const config = {
  papers: {
    database: { sequelize }
  }
};

staple.setup(config).then(() => {
  const app = express();

  app.use(staple.router);

  sequelize.sync();
  app.listen(4000, () =>
    console.log("⚡ Express Server with Sequelize running on port 4000")
  );
});
