const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { crypto } = require("users-paper/utils");

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
    async sendEmail(templateOrOptions) {
      const isOptions = typeof templateOrOptions === "object";
      const template = isOptions
        ? templateOrOptions.template
        : templateOrOptions;
      const options = isOptions ? templateOrOptions : {};

      const { booklet } = this._modelOptions;
      const { email } = booklet.find("mailer");

      await email.send({
        ...options,
        template,
        message: {
          to: this.email,
          ...(options.message || {})
        },
        locals: {
          ...(options.locals || {}),
          user: this.toJSON()
        }
      });
    },
    toJSON() {
      const values = this.get();
      delete values.password;
      delete values.updatePasswordToken;
      delete values.updatePasswordTokenExpires;
      return values;
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
