const express = require("express");
const staple = require("staple");
const Sequelize = require("sequelize");

staple.setup({
  sequelize: new Sequelize(
    "postgres://postgres:postgres@localhost:5432/staple-with-sequelize"
  )
  // database: {
  //   retrieve: (model, query) => sequelize.model(model).find(query)
  // }
});

const app = express();

app.post("/api/users/login", staple.users.login);
app.post("/api/users/signup", staple.users.signup);
app.post("/api/users/forgot-password", staple.users.forgotPassword);
app.post("/api/users/reset-password/:token", staple.users.resetPassword);

// app.get("/api/shop/plans", staple.shop.plans.list);
// app.post("/api/shop/plans", staple.shop.plans.create);

app.listen(4000);
