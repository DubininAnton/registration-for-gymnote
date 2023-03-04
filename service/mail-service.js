const nodemailer = require('nodemailer')
const config = require('../utils/config')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: config.SMTP_USER,
      to,
      subject: `Активация аккаунта на ${config.API_URL}`,
      text: '',
      html:
      `
      <div>
        <h1>Для активации перейдите по ссылке</h1>
        <a href="${link}">${link}</a>
      </div>
      `,
    })
  }
}

module.exports = new MailService();
