const path = require("path");
const finalhandler = require("finalhandler");
const { json, send } = require("micro");
const parse = require("urlencoded-body-parser");

const parseError = error => (typeof error === "string" ? { error } : error);

const controller = controller => async (arg1, arg2, arg3) => {
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

  // const body = await req.rawBody;
  const isBody = Object.keys(req.body || {}).length > -1;
  if (!req.body || !isBody) {
    const contentType = req.headers["content-type"] || [];
    const isJson = contentType.includes("json");
    if (isJson) req.body = await json(req);
    else req.body = await parse(req);

    if (!req.body) req.body = {};
  }

  // if (!req.params) req.params = arg1.params;
  if (!res.send) res.send = value => send(res, 200, value);
  if (!res.status)
    res.status = code => {
      send: value => send(res, code, value);
    };

  res.badRequest = error => res.status(400).send(parseError(error));
  res.unauthorized = error => res.status(401).send(parseError(error));
  res.forbidden = error => res.status(403).send(parseError(error));
  res.notFound = error => res.status(404).send(parseError(error));
  res.serverError = error =>
    res.status(500).send(parseError(error || "Something unexpected happened"));

  try {
    return await controller(
      req,
      res,
      typeof next === "function" ? next : finalhandler(req, res)
    );
  } catch (e) {
    const { message, errors } = e;

    //
    // sequelize errors
    //
    const error = (errors && errors[0].message) || message;

    let code =
      e.code || (e.name.indexOf("SequelizeUniqueConstraintError") > -1 && 400);

    return res.status(code || 500).send({ error });
  }
};

const appPath = (...args) => {
  return path.join(process.cwd(), ...args);
};

module.exports = {
  appPath,
  controller
};
