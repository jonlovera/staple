const Email = require("email-templates");

module.exports = ({ booklet, controller, database }) => {
  const paper = booklet.find("current");
  // @TODO throw errors if missing configurations

  const email = new Email({
    // uncomment below to send emails in development/test env:
    send: process.env.NODE_ENV === "development",
    ...paper.config.get()
  });

  // Add function to share with other papers
  paper.email = email;
};
