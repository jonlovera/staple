const { router, ...methods } = require("microrouter");

const methodsMap = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "del",
  HEAD: "head",
  OPTIONS: "options"
};

module.exports = ({ staple, controller }) => {
  let appRouter,
    routes = [];

  setTimeout(() => {
    const { booklet } = staple;
    if (!appRouter) {
      Object.keys(booklet).map(name => {
        const paper = booklet[name];
        const { routes: paperRoutes } = paper;
        if (paperRoutes.length) {
          paperRoutes.map(route => {
            let { path, method, controller } = route;

            if (path && method && controller) {
              method = methodsMap[method];
              routes.push(methods[method](path, controller));
            }
          });
        }
      });

      appRouter = router(...routes);
    }
  });

  return controller(async (req, res, next) => {
    const route = await appRouter(req, res);

    if (route) return route;
    if (!route && typeof next === "function") return next();
    return res.notFound();
  });
};
