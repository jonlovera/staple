const crypto = require("crypto");

module.exports.crypto = {
  randomBytes: args => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(args, (err, buffer) => {
        if (err) return reject(err);
        return resolve(buffer);
      });
    });
  }
};
