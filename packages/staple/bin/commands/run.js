const sh = require("shelljs");
const { debounce } = require("throttle-debounce");
const colors = require("colors/safe");
const PrettyError = require("pretty-error");
const pe = new PrettyError();

// config
const config = require("../globals");

// // utilities
// const { delay } = require("../utils");
// const loader = require("../utils/loaders");
// const { exec } = require("../utils/shelljs");

exports.command = "run [command..]";
exports.desc = "Run staple in the current folder";

const logger = {
  state: {},
  print: debounce(350, function() {
    process.stdout.write(
      process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
    );

    const { staple, ...rest } = this.state;
    const state = { ...rest, staple };
    const logs = Object.keys({ ...rest, staple });

    const errorLogKey = logs.find(key => state[key] && state[key].error);

    if (errorLogKey) console.error(pe.render(state[errorLogKey].error));

    if (!errorLogKey) {
      Object.keys(state).map(key => {
        if (key === "staple") {
          const stapleLogo = colors.cyan("┌┐");
          if (logs.length > 1) console.log("");
          console.log(
            `${stapleLogo} Staple is runing on the background.` // Press L to see more options.`
          );
        } else {
          const log = state[key];
          if (log.info) {
            process.stdout.write(log.info);
          }
          if (log.defaultMessage && log.showDefaultMessage) {
            process.stdout.write(`\n${log.defaultMessage}\n`);
          }
        }
      });
    }
  }),
  log(name, type) {
    return message => {
      if (!this.state[name]) this.state[name] = {};
      delete this.state[name][type];

      if (type === "info") {
        debounce(200, () => {
          const log = this.state[name];

          if (log && log[type]) {
            this.state[name][type] += message;
          } else {
            this.state[name][type] = message;
          }
        })();
      } else {
        this.state[name][type] = message;
      }

      this.print();
    };
  }
};

exports.handler = async args => {
  const command = args.command.join(" ");
  const isCRA = command.indexOf("react-scripts") > -1;

  sh.cd(config.paths.current);
  const userCommand = sh.exec(`${command} --color=always`, {
    silent: true,
    async: true
  });

  userCommand.stdout.on("data", message => {
    // @TODO add exception for different frameworks. Currently only supports create-react-app.
    if (isCRA && logger.state.user) {
      const defaultMessage = logger.state.user.defaultMessage || "";
      const start =
        message.indexOf("You can now view") > -1 ||
        defaultMessage.indexOf("You can now view") > -1;
      const end = defaultMessage.indexOf("npm run build") > -1;

      if (start && !end) {
        logger.log("user", "defaultMessage")(`${defaultMessage}${message}`);
      }

      const hideDefaultMessage =
        logger.state.user.info && logger.state.user.info.length >= 2;
      logger.log("user", "showDefaultMessage")(hideDefaultMessage);
    }

    logger.log("user", "info")(message);
  });
  userCommand.stderr.on("data", logger.log("user", "error"));

  sh.cd(config.paths.project);
  const stapleCommand = sh.exec(`npm start --color=always`, {
    silent: true,
    async: true
  });

  stapleCommand.stdout.on("data", logger.log("staple", "info"));
  stapleCommand.stderr.on("data", logger.log("staple", "error"));

  userCommand.stdout.on("close", () => stapleCommand.kill());
  stapleCommand.stdout.on("close", () => userCommand.kill());
};
