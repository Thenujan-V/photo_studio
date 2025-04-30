const express = require('express')
const router = express.Router()
const feedbackController = require('../controller/feedBackController')

router.post('/create-feedback/:clientId', feedbackController.createFeedback)
router.get('/get-feedbacks', feedbackController.getFeedback)
router.delete('/delete-feedback/:id', feedbackController.deleteFeedback)
router.patch('/reply-msg/:id', feedbackController.replyFeedback)



module.exports = router