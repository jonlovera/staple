const path = require("path");
const finalhandler = require("finalhandler");

module.exports.controller = controller => (arg1, arg2, arg3) => {
  let req = arg1,
    res = arg2,
    next = arg3;

  // if the first arg has req and res means that is Koa
  // and if it's Koa means that the arg2 is next
  if (arg1.req && arg1.res) {
    req = arg1.req;
    res = arg1.res;
    next = arg2;
  }

  return controller(
    req,
    res,
    typeof next === "function" ? next : finalhandler(req, res)
  );
};

module.exports.appPath = (dir = "") => {
  return path.join(process.cwd(), dir);
};
