const sh = require("shelljs");
const fs = require("fs-extra");
const Email = require("email-templates");

sh.config.silent = true;

module.exports = async ({ booklet, controller, database, appPath }) => {
  const emailsPath = appPath("emails");
  await fs.ensureDir(emailsPath);
  const papersEmails = appPath("node_modules", "*-paper/emails/*");
  sh.cp("-rfn", papersEmails, emailsPath);

  const paper = booklet.find("current");
  // @TODO throw errors if missing configurations

  const email = new Email({
    // uncomment below to send emails in development/test env:
    send: process.env.NODE_ENV === "development",
    ...paper.config.get(),
    transport: {
      jsonTransport: true,
      ...paper.config.get("transport")
    },
    views: {
      ...paper.config.get("views"),
      options: {
        extension: "hbs", // <---- HERE
        ...paper.config.get("views.options")
      }
    }
  });

  // Add function to share with other papers
  paper.email = email;
};
