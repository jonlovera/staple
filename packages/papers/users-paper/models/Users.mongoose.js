const bcrypt = require("bcrypt");

module.exports = {
  attributes: {
    // id: { prefix: "user" },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
      // validate: [validate({ validator: 'isEmail' })],
    },
    password: {
      type: String,
      required: true
    }
  },

  // instance methods
  instanceMethods: {
    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password);
    },
    toJSON(doc) {
      delete doc.password;
      return doc;
    }
  },

  // hooks
  hooks: {
    async beforeSave(next) {
      if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10);

      next();
    }
  }
};
