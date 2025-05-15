const express = require('express');
const router = express.Router()
const mailController = require('../controller/emailController');

router.post('/send-mail', mailController.sendEmail);

module.exports = router;
