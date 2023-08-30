const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на сайте ashimka.ru",
      text: "",
      html: `
      <div>
        <h1>Для активации кликните по ссылке</h1>
        <p>Если Вы не регистрировались на сайте, то проигнорируйте письмо</p>
        <a href="${link}"> активировать</a>
      </div>      
`,
    });
  }
}

module.exports = new MailService();
