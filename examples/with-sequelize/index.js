const express = require("express");
const staple = require("staple");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/staple-with-sequelize"
);

staple.setup({
  sequelize,
  // database: {
  //   retrieve: (model, query) => sequelize.model(model).find(query)
  //   models: {
  //     User
  //   }
  // },
  papers: {
    users: {
      jwt: {
        privateKey: "MY_SUPER_SECRET_PRIVATE_KEY"
      }
    },
    mailer: {
      message: {
        from: "no-reply@yourwebsite.com"
      },
      transport: {
        jsonTransport: true
      },
      views: {
        options: {
          extension: "hbs" // <---- HERE
        }
      }
    }
  }
});

const app = express();

app.post("/api/users/login", staple.users.login);
app.post("/api/users/signup", staple.users.signup);
app.post("/api/users/forgot-password", staple.users.forgotPassword);
app.put("/api/users/update-password/:token", staple.users.updatePassword);

// app.get("/api/shop/plans", staple.shop.plans.list);
// app.post("/api/shop/plans", staple.shop.plans.create);

// sequelize.sync({ force: true });
sequelize.sync();

app.listen(4000);
