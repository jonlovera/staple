const Koa = require("koa");
const staple = require("staple");

staple.setup().then(() => {
  const app = new Koa();

  app.get("/contact", async ctx => {
    const { email } = staple.booklet.find("mailer");
    const message = "Hi,\n I would like to know how use your awesome product. \n\n Regards,\n\n John.".replace(
      /(?:\r\n|\r|\n)/g,
      "<br>"
    );

    await email.send({
      template: "contact",
      message: {
        to: "admin@mywebsite.com",
        replyTo: "john.smith@gmail.com"
      },
      locals: {
        name: "John Smith",
        email: "john.smith@gmail.com",
        message: message
      }
    });

    ctx.body = { message: "Message sent." };
  });

  app.listen(4000, () => console.log("⚡ Koa Server running on port 4000"));
});
