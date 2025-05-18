const express = require('express')
const router = express.Router()
const invoiceController = require('../controller/invoiceController')
const upload = require('../middleware/upload')

router.post("/store/:orderId", upload.array('invoice', 1), invoiceController.storeInvoiceToDB)
router.get("/view/:orderId", invoiceController.viewInvoice)


module.exports = router