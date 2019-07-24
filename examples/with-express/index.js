const express = require("express");
const staple = require("staple").setup();

const app = express();

app.post("/api/users/login", staple.users.login);
app.post("/api/users/signup", staple.users.signup);
app.post("/api/users/forgot-password", staple.users.forgotPassword);
app.post("/api/users/reset-password/:token", staple.users.resetPassword);

// app.get("/api/shop/plans", staple.shop.plans.list);
// app.post("/api/shop/plans", staple.shop.plans.create);

app.listen(4000);
