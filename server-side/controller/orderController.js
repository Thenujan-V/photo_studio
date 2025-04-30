const orderModel = require('../models/orderModel')
const cartModel = require('../models/cartModel')

const createOrder = async(req, res) => {
    try{
        const { clientId } = req.params
        const { cartItems } = req.body

        if(!Array.isArray(cartItems) || cartItems.length === 0){
            return res.status(400).json({ message: "Cart is empty or not valid." });
        }

        const orderResult = await orderModel.createOrder(clientId)
        const orderId = orderResult.insertId 

        const resultForDetails = []

        for(const item of cartItems){
            const { cart_id, service_category_id, service_id, quantity } = item
            const result = await orderModel.createOrderDetails({ order_id: orderId, service_category_id, service_id, quantity})
            resultForDetails.push(result)
        }
        await cartModel.cartDeleteByClientId(clientId)


        
        res.status(201).json({ 
            message: "Successfully created.", 
            order_id: orderId,
            orderDetails: resultForDetails
        })

    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create client.'
        })
    }

} 

const addPhotosForOrders = async (req, res) => {
    try{
        const { orderDetailsId } = req.params
        const files = req.files
    
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one photo is required.' });
        }
    
        const file_paths = files.map(file => file.filename)
    
        const addPhotosResult = await orderModel.addClientsPhotosForOrders({ file_paths, orderDetailsId })
    
        res.status(201).json({ message: "successfully photos added."})        
    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create client.'
        })
    }
}

const getOrdersByClientId = async (req, res) => {
    try{
        const { clientId } = req.params
        
        const getOrdersResult = await orderModel.orderFetchByClientId(clientId)
    
        res.status(201).json({ message: "successfully fetched.", getOrdersResult })        
    }catch(err){
        console.log('Error when save client.', err)
        return res.status(500).json({
            message: 'Internal server error. Faild to create client.'
        })
    }
} 



module.exports = { createOrder, addPhotosForOrders, getOrdersByClientId }