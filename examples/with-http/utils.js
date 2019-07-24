module.exports.middleware = (...fns) =>
  fns.reduce((f, g) => (req, res, next) =>
    g(
      req,
      res,
      () => f(req, res, next) || (typeof next === "function" && next())
    )
  );
