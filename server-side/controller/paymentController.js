const paymentModel = require('../models/paymentModel')

const createPaymentDetails = async (req, res) => {
    try{
    console.log("od :", req.body)

        const { orderId, clientId, totalAmount, paymentMethod, status} = req.body

        const validStatusCode = ['processing', 'parcial_payment', 'complete', 'failed']
        const validPaymentMethod = ['Cash', 'Card']

        const isValidPaymentMethod = (method) => {
            return validPaymentMethod.includes(method)
        }
        const isValidStatusCode = (method) => {
            return validStatusCode.includes(method)
        }

        if(!orderId || !clientId || ! totalAmount || !paymentMethod || !status){
            return res.status(400).json( {message: "bad request. something missing."})
        }
        if(!isValidPaymentMethod(paymentMethod)){
            return res.status(400).json( {message: "bad request for not valid payment method."})
        }
        if(!isValidStatusCode(status)){
            return res.status(400).json( {message: "bad request for not valid status code."})
        }
        const saveDetails = await paymentModel.paymentDetailsCreate({ orderId, clientId, totalAmount, paymentMethod, status})
        return res.status(201).json({
                message: 'payment Details saved successfully.',
                saveDetails
            })

    }catch(err){
        console.log('Error when save payment.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create payments.'
        })
    }
}

const fetchAllDetails = (req, res) => {
    try{
        const paymentDetails = paymentModel.getPaymentDetails()
        if(paymentDetails === null){
            return res.status(404).json({message: "There are no datails."})
        }
        return res.status(201).json({
                message: 'payment Details fetched successfully.',
                paymentDetails
            })

    }catch(err){
        console.log('Error when save payment.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create payments.'
        })
    }
}

const updateStatus = async(req, res) => {
    try{
        const {status} = req.data
        const validStatusCode = ['processing', 'parcial_payment', 'complete', 'failed']
        const isValidStatusCode = (method) => {
            return validStatusCode.includes(method)
        }
        if(isValidStatusCode(status)){
            return res.status(400).json( {message: "bad request."})
        }

        const paymentDetails = await paymentModel.getPaymentDetails()
        if(paymentDetails === null){
            return res.status(404).json({message: "There are no datails."})
        }
        return res.status(200).json({
                message: 'Status update successfully.',
                paymentDetails
            })

    }catch(err){
        console.log('Error when save payment.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create payments.'
        })
    }
}



module.exports =  {fetchAllDetails, createPaymentDetails, updateStatus}