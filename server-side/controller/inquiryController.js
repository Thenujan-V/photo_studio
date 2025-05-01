const inquiryModel = require('../models/inquiryModel')


const createInquiry = async(req, res) => {
    try{
        const { userName, mail, inquiryMsg } = req.body

        const createInquiryResult = await inquiryModel.saveInquiry({ userName, mail, inquiryMsg})

        res.status(201).json({ message: "successfully create inquiry", id: createInquiryResult.insertId})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch feedback.'
        })
    }
}

const fetchInquiry = async(req, res) => {
    try{
        const fetchInquiryResult = await inquiryModel.getInquiries()

        if(fetchInquiryResult === 0){
            return res.status(404).json({ message: "There are no inquiry details."})
        }

        res.status(200).json({ message: "successfully fetched inquiries", fetchInquiryResult})

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch feedback.'
        })
    }
} 


module.exports = { createInquiry, fetchInquiry }