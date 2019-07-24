const Koa = require("koa");
const staple = require("staple");

const app = new Koa();

app.post("/api/users/login", staple.users.login);
app.post("/api/users/signup", staple.users.signup);
app.post("/api/users/forgot-password", staple.users.forgotPassword);
app.post("/api/users/reset-password/:token", staple.users.resetPassword);

// app.get("/api/shop/plans", staple.shop.plans.list);
// app.post("/api/shop/plans", staple.shop.plans.create);

app.listen(4000);
