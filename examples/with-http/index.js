const staple = require("staple").setup();

const { middleware } = require("./utils");

require("http")
  .createServer(
    middleware()
    // staple.users
    // staple.shop
  )
  .listen(4000);
