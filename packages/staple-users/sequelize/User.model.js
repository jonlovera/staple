const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    }
  },

  // instance methods
  instanceMethods: {
    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password);
    },
    toJSON() {
      const values = this.get();
      delete values.password;
      return values;
    }
  },

  // class methods
  classMethods: {
    async login({ email, password }) {
      const user = await this.retrieve({ email });

      if (user) {
        const isValidPassword = await user.verifyPassword(password);
        const privateKey = this.getCurrentPaper("config.jwt.privateKey");

        const token = jwt.sign({ user }, privateKey);

        if (isValidPassword) return { user, token };
      }

      return null;
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
