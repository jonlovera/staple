const jwt = require("jsonwebtoken");
const user = require("./sequelize/User.model");
//
module.exports = ({ booklet, route, database }) => {
  const { config } = booklet.find("current");
  const privateKey = config.get("jwt.privateKey") || "users_development_key";

  //
  // Define database models
  //
  const User = database.model("User", user);

  return {
    //
    // Login route
    //
    login: route({
      method: "POST",
      controller: async (req, res) => {
        const { email, password } = req.body;
        if (!password || !email) {
          const param = !email ? "Email" : "Password";
          return res.badRequest(`${param} is required`);
        }

        const user = await User.retrieve({ email });
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
      method: "POST",
      controller: async (req, res) => {
        const user = await User.create(req.body);
        if (user) return res.send(user);
        return res.serverError();
      }
    }),

    //
    // Forgot password route
    //
    forgotPassword: route({
      method: "POST",
      controller: async (req, res) => {
        const { email } = req.body;
        const user = await User.retrieve({ email });

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

        const user = await User.retrieve({ updatePasswordToken: token });

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
