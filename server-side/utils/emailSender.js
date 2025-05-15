require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMailToClient = async (toEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    html: `<p>${message}</p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMailToClient;
