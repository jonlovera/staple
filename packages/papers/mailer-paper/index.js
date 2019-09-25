const sh = require("shelljs");
const fs = require("fs-extra");
const Email = require("email-templates");

sh.config.silent = true;

module.exports = async function setup({ paths }) {
  const emailsPath = paths.app("emails");
  await fs.ensureDir(emailsPath);
  const papersEmails = paths.app("node_modules", "*-paper/emails/*");
  sh.cp("-rfn", papersEmails, emailsPath);

  const email = new Email({
    // uncomment below to send emails in development/test env:
    send: process.env.NODE_ENV === "development",
    ...this.config.get(),
    transport: {
      jsonTransport: true,
      ...this.config.get("transport")
    },
    views: {
      ...this.config.get("views"),
      options: {
        extension: "hbs", // <---- HERE
        ...this.config.get("views.options")
      }
    }
  });

  // Add function to share with other papers
  this.email = email;
};
