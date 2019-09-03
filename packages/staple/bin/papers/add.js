const loader = require("../utils/loaders");
const { exec } = require("../utils/shelljs");

module.exports = async args => {
  // const packages = args.names.map(name => `${name}-paper`);
  const packages = args.names.map(name => `staple-${name}`);

  loader.default.start();
  loader.default.text = "Installing npm packages";
  try {
    // console.log("exec", exec);
    await exec(`npm i --save ${packages.join(" ")}`);
    loader.default.succeed();

    loader.stapling.start();
    loader.stapling.text = "Stapling papers";
    // loader.stapling.succeed();
  } catch (e) {
    loader.default.fail();
    console.log("");
    console.error(e);
  }
};
