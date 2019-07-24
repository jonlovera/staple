const { parse } = require("staple");
const { send } = require("micro");

module.exports = ({ controller, database }) => {
  const User = database.model("User");

  return {
    login: controller(async (req, res) => {
      const { email, password } = await parse(req);
      let code, error, user;

      if (!password) error = "Password is required";
      if (!email) error = "Email is required";

      if (!error) {
        code = 200;
        // const user = await User.login({ email, password });
        user = { email, password };
      }

      send(res, code || 400, { error, user });
    }),
    signup: controller(async (req, res) => {
      const statusCode = 200;
      const data = { data: "Signup" };

      send(res, statusCode, data);
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
