const cartModel = require('../models/cartModel')

const addToCart = async(req, res) => {
    try{
        const { clientId, categoryId, serviceId } = req.params

        const checkClient = await cartModel.findByClientId(clientId)
        const checkCategory = await cartModel.findByCategoryId(categoryId)
        const checkService = await cartModel.findByServiceId(serviceId)

        if(checkClient.length !== 0 && checkCategory.length !== 0 && checkService.length !== 0){
            return res.status(400).json({message :'Already this item added into cart.'})
        }
    
        await cartModel.cartCreate({clientId, categoryId, serviceId})
        res.status(201).json({message: "cart created."})

    }catch(err){
        console.log('error when cart creation.', err)
        res.status(500).json({message :"Internel server error."})
    }
}

const getFromCart = async(req, res) => {
    try{
        const { clientId} = req.params
        const cartDetails = await cartModel.findAllByClientId(clientId)

        if(cartDetails.length === 0){
            return res.status(204).json({message: "cart is empty."})
        }

        res.status(200).json({message: "Successfully fetched.", cartDetails})

    }catch(err){
        console.log('error when cart creation.', err)
        res.status(500).json({message :"Internel server error."})
    }
}

const changeQuantity = async(req, res) => {
    try{
        const { cartId} = req.params
        const { quantity } = req.body

        if(quantity === 0){
            this.deleteCart()
        }

        const checkCart = await cartModel.findByCartId(cartId)

        if(checkCart.length === 0){
            return res.status(204).json({message: "There is no content in this cart id."})
        }

        await cartModel.editQuantity(cartId, quantity)

        res.status(200).json({message: "Successfully edit quantity."})

    }catch(err){
        console.log('error when cart creation.', err)
        res.status(500).json({message :"Internel server error."})
    }
}

const deleteCart = async(req, res) => {
    try{
        const { cartId } = req.params

        const checkCart = await cartModel.findByCartId(cartId)

        if(checkCart.length === 0){
            return res.status(204).json({message: "There is no content in this cart id."})
        }

        await cartModel.cartDetelet(cartId)

        res.status(200).json({message: "Successfully delete cart."})

    }catch(err){
        console.log('error when cart deletion.', err)
        res.status(500).json({message :"Internel server error."})
    }
}










module.exports = {addToCart, getFromCart, changeQuantity, deleteCart}