const jwt = require("jsonwebtoken");
// const user = require("./sequelize/Users.model");

module.exports = async function setup({ booklet, database, route }) {
  const config = this.config;
  const privateKey = config.get("jwt.privateKey") || "users_development_key";

  //
  // Define database models
  //
  const Users = database.model("Users");

  return {
    //
    // Login route
    //
    login: route({
      path: "/login",
      method: "POST",
      controller: async (req, res) => {
        const { email, password } = req.body;
        if (!password || !email) {
          const param = !email ? "Email" : "Password";
          return res.badRequest(`${param} is required`);
        }

        const user = await Users.retrieve({ email });
        if (user) {
          const isValidPassword = await user.verifyPassword(password);

          if (isValidPassword) {
            const token = jwt.sign({ user }, privateKey);
            return res.send({ user, token });
          }
        }

        return res.badRequest("Invalid email or password.");
      }
    }),

    //
    // Signup route
    //
    signup: route({
      path: "/signup",
      method: "POST",
      controller: async (req, res) => {
        const user = await Users.create(req.body);
        if (user) return res.send(user);
        return res.serverError();
      }
    }),

    //
    // Forgot password route
    //
    forgotPassword: route({
      path: "/forgot-password",
      method: "POST",
      controller: async (req, res) => {
        const { email } = req.body;
        const user = await Users.retrieve({ email });

        if (user) {
          const { token, expires } = await user.generateResetPasswordToken();
          await user.sendEmail({
            template: "forgot-password",
            message: { subject: "Forgot password request" },
            locals: {
              action_url: `http://localhost:3000/reset-password?tk=${token}`
            }
          });
        }

        return res.send({ message: "Password requested." });
      }
    }),

    //
    // Update password route
    //
    updatePassword: route({
      path: "/update-password/:token",
      method: "POST",
      controller: async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) return res.badRequest("Password is required.");

        const user = await Users.retrieve({ updatePasswordToken: token });

        if (user) {
          user.update({
            password,
            updatePasswordToken: null,
            updatePasswordTokenExpires: null
          });
          return res.send({ message: "Password was updated succesfully." });
        }

        return res.badRequest("Invalid token or the token has expired.");
      }
    })
  };
};
