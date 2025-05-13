const express = require('express')
const router = express.Router()
const paymentController = require('../controller/paymentController')

router.post('/create-payment', paymentController.createPaymentDetails)
router.get('/get-all-payments', paymentController.fetchAllDetails)
router.patch('/status-update/:paymentId', paymentController.updateStatus)


module.exports = router