const jwt = require("jsonwebtoken");
const user = require("./sequelize/User.model");

module.exports = ({ paper, controller, database }) => {
  const User = database.model("User", user);

  return {
    login: controller(async (req, res) => {
      const { email, password } = req.body;
      if (!password || !email) {
        const param = !email ? "Email" : "Password";
        return res.badRequest(`${param} is required`);
      }

      const user = await User.retrieve({ email });
      if (user) {
        const isValidPassword = await user.verifyPassword(password);
        const privateKey = paper.getConfig("jwt.privateKey");

        const token = jwt.sign({ user }, privateKey);

        if (isValidPassword) return res.send({ user, token });
      }

      return res.badRequest("Invalid email or password.");
    }),
    signup: controller(async (req, res) => {
      const user = await User.create(req.body);
      if (user) return res.send(user);
      return res.serverError();
    }),
    forgotPassword: controller(async (req, res) => {
      const { email } = req.body;
      const message = await User.forgotPassword(email);
      return res.send({ message });
    }),
    updatePassword: controller(async (req, res) => {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) return res.badRequest("Password is required");

      const message = await User.updatePassword(token, password);
      if (message) return res.send({ message });

      return res.badRequest("Invalid token.");
    })
  };
};
