const { router, ...methods } = require("microrouter");
const codeGenerator = require("./codeGenerator");

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

  setTimeout(async () => {
    const { booklet } = staple;
    if (!appRouter) {
      Object.keys(booklet).map(name => {
        const paper = booklet[name];
        const { routes: paperRoutes } = paper;

        if (paperRoutes.length) {
          paperRoutes.map(route => {
            const { path, controller } = route;
            const method = route.method ? methodsMap[route.method] : null;

            if (path && method && controller) {
              routes.push(methods[method](path, controller));
            }
          });
        }
      });

      await codeGenerator({ booklet, methodsMap });
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
