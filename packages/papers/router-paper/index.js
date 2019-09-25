const { join } = require("path");
const { router, ...methods } = require("microrouter");

// const codeGenerator = require("./codeGenerator");

const methodsMap = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "del",
  HEAD: "head",
  OPTIONS: "options"
};

module.exports = function setup({ controller, registerHelper }) {
  const routes = [];

  registerHelper("route", function route(options) {
    if (typeof options === "object") {
      const name = this.name.replace("-paper", "");
      const path = options.fullPath || join("/api", name, options.path);
      let method = (options.method || "get").toUpperCase();
      method = method ? methodsMap[method] : null;
      const ctrl = controller(options.controller);

      if (path && method && ctrl) routes.push(methods[method](path, ctrl));

      return ctrl;
    }

    return null;
  });

  let appRouter;
  setTimeout(() => {
    if (!appRouter) appRouter = router(...routes);
  });

  return controller(async (req, res, next) => {
    const route = await appRouter(req, res);

    if (route) return route;
    if (!route && typeof next === "function") return next();
    return res.notFound();
  });
};
