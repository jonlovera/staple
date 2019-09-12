const path = require("path");
const fs = require("fs-extra");

// globals
const config = require("../globals");

// utilities
const { delay } = require("../utils");
const sh = require("../utils/shelljs");
const loader = require("../utils/loaders");

module.exports = async () => {
  try {
    const projectDir = config.paths.project;
    const stapleExists = await fs.pathExists(projectDir);

    if (!stapleExists) {
      loader.default.start();
      loader.default.text = "Loading the stapler";

      await fs.ensureDir(projectDir);

      // Initialize package.json if it doesn't exists (-n)
      sh.cp("-rn", path.join(config.paths.staple, "template/*"), projectDir);

      // @TODO this is only for development purposes only
      if (config.env.development) {
        const lerna = {
          packages: [
            ".",
            path.join(config.paths.staple, "../*"),
            path.join(config.paths.paperPackages, "*")
          ],
          version: "0.0.0"
        };

        await fs.outputFile(
          path.join(projectDir, "lerna.json"),
          JSON.stringify(lerna)
        );

        await sh.cp(
          path.join(projectDir, "lerna.json"),
          path.join(config.paths.current, "lerna.json")
        );
      }
    }

    sh.cd(projectDir);

    if (!stapleExists) {
      if (config.env.development) {
        sh.cd(config.paths.current);
        await sh.exec("lerna add staple . --dev");

        sh.cd(projectDir);
        await sh.exec("lerna add staple .");
        await delay(1000);
        await sh.exec("lerna add routes-paper .");
      } else {
        sh.cd(config.paths.current);
        await sh.exec("npm i --save-dev staple");

        sh.cd(projectDir);
        await sh.exec("npm i");
        await sh.exec("npm i --save staple routes-paper");
      }

      loader.default.succeed();
    }

    const pkgJsonFile = path.join(config.paths.current, "package.json");
    const pkg = await fs.readJson(pkgJsonFile);

    if (pkg.scripts) {
      let pkgJsonChanged = false;

      Object.keys(pkg.scripts).map(key => {
        const script = pkg.scripts[key];
        const supportedPkgs = ["react-scripts start"];

        if (supportedPkgs.indexOf(script) > -1) {
          const stapleExists = script.indexOf("staple run ") > -1;
          if (!stapleExists) {
            pkg.scripts[key] = `staple run ${script}`;
            pkgJsonChanged = true;
          }
        }
      });

      if (pkgJsonChanged)
        await fs.outputJson(pkgJsonFile, pkg, { spaces: "\t" });
    }

    return {};
  } catch (e) {
    loader.default.fail();
    console.log("");
    console.error(e);
    process.exit(1);
  }
};
