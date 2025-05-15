const sendMailToClient = require('../utils/emailSender');

const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendMailToClient(to, subject, message);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

module.exports = { sendEmail };
