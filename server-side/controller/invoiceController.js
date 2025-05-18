const invoiceModel = require('../models/invoiceModel')

const storeInvoiceToDB = async (req, res) => {
    try{
        const { orderId } = req.params
        const files = req.files
    
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Invoice photo is required.' });
        }
        const existingInvoice = await invoiceModel.findInvoiceByOrderId(orderId)
        if(existingInvoice.length !== 0){
            return res.status(400).json({message: "Try duplicated entry."})
        }
    
        const file_paths = files.map(file => file.filename)
    
        const storeInvoiceResult = await invoiceModel.invoiceAddIntoDB( orderId, file_paths )
    
        res.status(201).json({ message: "successfully invoice added.", storeInvoiceResult})        
    }catch(err){
        console.log('Error when save invoice.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to store invoice.'
        })
    }
}

const viewInvoice = async (req, res) => {
    const {orderId} = req.params
    try{
        const existingInvoice = await invoiceModel.findInvoiceByOrderId(orderId)
        if(existingInvoice.length === 0){
            return res.status(400).json({message: "There is no invoice in this orderID."})
        }
        res.status(200).json({message: 'Successfully fetched.', existingInvoice})
    }catch(err){
        console.log('Error when fetch invoice.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to fetch invoice.'
        })
    }
}

module.exports = {
    storeInvoiceToDB, viewInvoice
}