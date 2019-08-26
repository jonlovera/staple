const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { crypto } = require("../utils");

module.exports = {
  attributes: {
    // id: { prefix: "user" },
    firstName: {
      type: Sequelize.STRING,
      required: true
    },
    lastName: {
      type: Sequelize.STRING,
      required: true
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      unique: true
      // validate: [validate({ validator: 'isEmail' })],
    },
    password: {
      type: Sequelize.STRING,
      required: true
    },
    updatePasswordToken: {
      type: Sequelize.STRING
    },
    updatePasswordTokenExpires: {
      type: Sequelize.DATE
    }
  },

  // instance methods
  instanceMethods: {
    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password);
    },
    async generateResetPasswordToken() {
      const token = (await crypto.randomBytes(20)).toString("hex");
      const expires = new Date();

      this.updatePasswordToken = token;
      this.updatePasswordTokenExpires = expires;

      await this.save();

      return { token, expires };
    },
    async sendEmail() {
      console.log("send email to: " + this.email);
    },
    toJSON() {
      const values = this.get();
      delete values.password;
      delete values.updatePasswordToken;
      delete values.updatePasswordTokenExpires;
      return values;
    }
  },

  // class methods
  classMethods: {
    async forgotPassword(email) {
      const user = await this.retrieve({ email });

      if (user) {
        const { token, expires } = await user.generateResetPasswordToken();
        await user.sendEmail("forgot-password");
        return "Password requested.";
      }
    },
    async updatePassword(updatePasswordToken, password) {
      const user = await this.retrieve({ updatePasswordToken });

      if (user) {
        user.update({
          password,
          updatePasswordToken: null,
          updatePasswordTokenExpires: null
        });
        return "Password was updated succesfully.";
      }
    }
  },

  // hooks
  hooks: {
    async beforeSave(instance, options) {
      if (instance.changed("password"))
        instance.password = await bcrypt.hash(instance.password, 10);
    }
  }
};
