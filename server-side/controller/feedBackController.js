const feedbackModel = require('../models/feedBackModel')

const createFeedback = async(req, res) => {
    try{
        const { clientId } = req.params
        const { feedback, rating } = req.body

        const feedbackResult = await feedbackModel.feedBackCreate({ feedback, rating, clientId })

        res.status(201).json({ message: "successfully added.", feedbackResult})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to feedback create.'
        })
    }
}

const getFeedback = async(req, res) => {
    try{
        const feedbackResult = await feedbackModel.fetchFeedBacks()

        if(feedbackResult.length === 0){
            return res.status(204).json({message: "There is no feedbacks."})
        }

        res.status(200).json({ message: "successfully fetched.", feedbackResult})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch feedback.'
        })
    }
}

const deleteFeedback = async(req, res) => {
    try{
        const { id } = req.params

        const feedbackResult = await feedbackModel.fetchFeedBacks()

        const findFeedbackById = feedbackResult.find(feedback => feedback.id === Number(id))

        if(findFeedbackById === undefined){
            return res.status(204).json({message: "There is no feedbacks in this id."})
        }

        const feedbackDeleteResult = await feedbackModel.deleteFeedback(id)

        res.status(200).json({ message: "successfully fetched.", feedbackDeleteResult})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch feedback.'
        })
    }
}

const replyFeedback = async(req, res) => {
    try{
        const { id } = req.params
        const { replyMsg } = req.body

        const feedbackResult = await feedbackModel.fetchFeedBacks()

        const findFeedbackById = feedbackResult.find(feedback => feedback.id === Number(id))

        if(findFeedbackById === undefined){
            return res.status(404).json({message: "There is no feedbacks in this id."})
        }

        const feedbackDeleteResult = await feedbackModel.giveReply(id, replyMsg)

        res.status(200).json({ message: "successfully fetched.", feedbackDeleteResult})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch feedback.'
        })
    }
}


module.exports = { createFeedback, getFeedback, deleteFeedback, replyFeedback }