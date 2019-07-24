const bcrypt = require("bcrypt");

module.exports = {
  model: {
    attributes: {
      id: { prefix: "user" },
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
    async verifyPassword(password) {
      return await bcrypt.compare(password, this.password);
    },

    // hooks
    async beforeSave(next) {
      if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10);

      next();
    },
    toJSON(doc) {
      delete doc.password;
      return doc;
    }
  }
};
