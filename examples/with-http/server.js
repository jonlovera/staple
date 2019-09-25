const staple = require("staple");
const { middleware } = require("./utils");

staple.setup().then(() => {
  require("http")
    .createServer(
      middleware()
      // staple.users
      // staple.shop
    )
    .listen(4000);
});
