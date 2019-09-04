module.exports = ({ controller, database }) => {
  return {
    plans: {
      list: controller(async (req, res) => {
        return res.send({ data: "Plans" });
      })
    }
  };
};
