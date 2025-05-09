import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const createCartItems = async (cartData) => {
    const { clientId, categoryId, serviceId} = cartData 

    if (!clientId || !categoryId || !serviceId) {
        throw new Error("Missing required cart data (clientId, categoryId, or serviceId).");
    }

    try{
        const response = await axios.post(`${API_BASE_URL}/cart/add-to-cart/${clientId}/${categoryId}/${serviceId}`,{})
        return response
    }catch(err){
        throw err
    }
    
}

export const fetchCartItems = async (clientId) => {
    if (!clientId) {
        throw new Error("Missing required cart data (clientId).");
    }

    try{
        const response = await axios.get(`${API_BASE_URL}/cart/get-from-cart/${clientId}`)
        return response

    }catch(err){
        throw err
    }
    
}


export const quantityUpdate = async (cartId, quantity) => {
    const cartBody = {quantity: quantity}
    if (!cartId) {
        throw new Error("Missing required cart data cart id.");
    }

    try{
        const response = await axios.patch(`${API_BASE_URL}/cart/quantity-change/${cartId}`, cartBody)
        return response

    }catch(err){
        throw err
    }
    
}

export const deleteCartItem = async (cartId) => {
    if (!cartId) {
        throw new Error("Missing required cart data cart id.");
    }

    try{
        const response = await axios.delete(`${API_BASE_URL}/cart/delete-cart/${cartId}`)
        return response

    }catch(err){
        throw err
    }
    
}