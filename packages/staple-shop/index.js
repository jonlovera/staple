const { send } = require("micro");

module.exports = ({ controller, database }) => {
  return {
    plans: {
      list: controller(async (req, res) => {
        const statusCode = 200;
        const data = { data: "Plans" };

        send(res, statusCode, data);
      })
    }
  };
};
