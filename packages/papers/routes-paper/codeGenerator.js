const path = require("path");
const fs = require("fs-extra");
const pathToRegexp = require("path-to-regexp");

const getParamsFromPath = path => {
  const keys = [];
  let newPath = `"${path}`;
  pathToRegexp(path, keys);

  const urlParams = keys.map(({ name, optional, asterisk }, i) => {
    let comma = "";
    if (i < keys.length - 1) comma = ' + "';

    optional = optional ? "?" : "";
    asterisk = asterisk ? "*" : "";
    const param = `/:${name + optional + asterisk}`;
    newPath = newPath.replace(param, `" + ${name}${comma}`);
    return name;
  });

  if (!urlParams.length) newPath += '"';

  return { path: newPath, params: urlParams };
};

module.exports = async ({ booklet, methodsMap }) => {
  const routesBooklet = Object.keys(booklet).filter(
    name => booklet[name].routes.length
  );

  let es6Code = "";
  routesBooklet.map(name => {
    const functions = [];

    const paper = booklet[name];
    paper.routes.map(route => {
      const { action, controller } = route;
      let { params, path } = getParamsFromPath(route.path);
      const method = route.method ? methodsMap[route.method] : null;

      let args = [...params];
      if (args.length > 1) args = ["params"];

      const withBody = ["post", "update"].includes(method);
      if (withBody) args.push("body");
      args.push("options");

      const vars =
        params.length > 1
          ? `var ${params.map(param => {
              return `${param} = addSlashIf(params["${param}"])`;
            })};`
          : params.length === 1
            ? `${params[0]} = addSlashIf(${params[0]})`
            : "";

      const opts = withBody ? "body, options" : "options";
      functions.push(`
        ${action}: function (${args.join(", ")}) {
          ${vars}

          return axios.${method}(${path}, ${opts});
        }`);
    });

    es6Code += `
    var ${name} = {
      ${functions.join(",\n")}
    };

    exports.${name}Paper = ${name};
  `;
  });
  // console.log("es6Code", es6Code);

  let code = await fs.readFile(path.join(__dirname, "./staple.browser.js"));

  code = code.toString();
  code = code.replace("// GENERATE_ROUTES_HERE", es6Code);
  code = code.replace(
    "// EXPORT_ROUTES_HERE",
    routesBooklet.map(name => `${name}: ${name}`)
  );

  // const exportBrowserPath = path.join(process.cwd(), "staple.js");
  // @TODO find way to config the generated file
  const exportBrowserPath = path.join(process.cwd(), "../src/staple.js");
  await fs.writeFile(exportBrowserPath, code);
};
