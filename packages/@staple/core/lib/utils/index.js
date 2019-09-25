module.exports.paths = require("./paths");
module.exports.controller = require("./controller");
module.exports.getter = require("./getter");

const bindAll = (self, object) => {
  const obj = { ...object };
  Object.keys(object).map(key => {
    if (typeof obj[key] === "function") obj[key] = obj[key].bind(self);
  });
  return obj;
};

module.exports.bindAll = bindAll;
