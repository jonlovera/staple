const { parse } = require("staple");

const user = require("./sequelize/User.model");

module.exports = ({ controller, database }) => {
  const User = database.model("User", user);

  return {
    login: controller(async (req, res) => {
      let code;
      let response = {};

      const { email, password } = await parse(req);

      if (!password || !email) {
        const param = !email ? "Email" : "Password";
        return res.badRequest(`${param} is required`);
      }

      const user = await User.login({ email, password });
      if (user) return res.send(user);

      return res.badRequest("Invalid email or password.");
    }),
    signup: controller(async (req, res) => {
      const params = await parse(req);
      const user = await User.create(params);

      if (user) return res.send(user);
    }),
    forgotPassword: controller(async (req, res) => {
      return res.send({ data: "Forgot password" });
    }),
    resetPassword: controller(async (req, res) => {
      return res.send({ data: "Reset password" });
    })
  };
};
