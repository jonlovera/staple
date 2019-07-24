const { parse } = require("staple");
const { send } = require("micro");

const user = require("./sequelize/User.model");

module.exports = ({ controller, database }) => {
  const User = database.model("User", user);
  // console.log("users", User);

  return {
    login: controller(async (req, res) => {
      const { email, password } = await parse(req);
      let code, error, user;

      if (!password) error = "Password is required";
      if (!email) error = "Email is required";

      if (!error) {
        code = 200;
        user = await User.login({ email, password });
      }

      send(res, code || 400, { error, user });
    }),
    signup: controller(async (req, res) => {
      const params = await parse(req);
      let code, error, user;

      if (!error) {
        code = 200;
        user = await User.create(params);
      }

      send(res, code || 400, { error, user });
    }),
    forgotPassword: controller(async (req, res) => {
      const statusCode = 200;
      const data = { data: "Forgot password" };

      send(res, statusCode, data);
    }),
    resetPassword: controller(async (req, res) => {
      const statusCode = 200;
      const data = { data: "Reset password" };

      send(res, statusCode, data);
    })
  };
};
