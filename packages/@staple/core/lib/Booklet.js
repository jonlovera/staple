"use strict";

const path = require("path");
const Topo = require("@hapi/topo");
const { addPath } = require("app-module-path");

// utilities
const { paths } = require("./utils");

const getPapersDependencies = json => {
  return Object.keys(json)
    .filter(key => key.includes("-paper"))
    .map(key => key.replace("-paper", ""));
};

class Booklet {
  constructor() {
    this.papers = {};

    // papers order of load
    this.order = new Topo();

    // @HACK for lerna to resolve link dependencies
    addPath(paths.app("node_modules"));
  }

  find(name) {
    return this.papers[name];
  }

  registerPapers(dependencies) {
    const papers = getPapersDependencies(dependencies);
    papers.map(pkgName => this.registerPaper(pkgName));
  }

  registerPaper(name) {
    name = name.includes("-paper") ? name.replace("-paper", "") : name;

    if (!this.papers[name]) {
      const pkgName = name.includes("-paper") ? name : `${name}-paper`;
      const paperPath = paths.nodeModule(pkgName);
      const paperNodeModulesPath = path.join(paperPath, "node_modules");

      // @HACK for lerna to resolve link dependencies
      addPath(path.join(paperPath, "node_modules"));

      const pkg = require(path.join(pkgName, "package.json"));
      this.registerPapers(pkg.dependencies);

      // load this paper after all the dependent papers have been loaded
      const papers = getPapersDependencies(pkg.dependencies);
      this.order.add(name, { after: papers });

      this.papers[name] = {
        name: pkgName,
        path: paperPath,
        setup: require(pkgName)
      };
    }
  }
}

module.exports = Booklet;
