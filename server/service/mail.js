const nodemailer = require("nodemailer");

async function sendMail(recipient, activationLink) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  console.log(recipient);
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    subject: "Shazam активация аккаунта",
    text: "",
    html: `
            <div>
                <h1>Для активации аккаунта перейдите по ссылке:</h1>
                <a href="${process.env.API_URL}user/activation/${activationLink}">${process.env.API_URL}user/activation/${activationLink}</a>
            </div>
        `,
  });
}

module.exports = sendMail;


