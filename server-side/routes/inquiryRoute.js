const express = require('express')
const router = express.Router()
const inquiryController = require('../controller/inquiryController')


router.post("/create-inquiry", inquiryController.createInquiry)
router.get("/get-inquiry", inquiryController.fetchInquiry)




module.exports = router