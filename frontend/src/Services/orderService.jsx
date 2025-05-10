import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const createOrder = async (clientId, orderData) => {
    const orderDatas = { cartItems: orderData}
    if (!clientId || !orderData) {
        throw new Error("Missing required cart data (clientId, categoryId, or serviceId).");
    }

    try{
        const response = await axios.post(`${API_BASE_URL}/orders/create-order/${clientId}`,orderDatas,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response
    }catch(err){
        throw err
    }
    
}

export const fetchOrdersByClientId = async (clientId) => {
    if (!clientId) {
        throw new Error("Missing required cart data (clientId).");
    }

    try{
        const response = await axios.get(`${API_BASE_URL}/orders/get-order-details/${clientId}`)
        return response
    }catch(err){
        throw err
    }
    
}


export const clientsUploadPhotos = async (orderDetailsId, formData) => {
    if (!orderDetailsId) {
        throw new Error("Missing required cart data (orderDetailsId).");
    }

    try{
        const response = await axios.post(`${API_BASE_URL}/orders/add-photos/${orderDetailsId}`,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response
    }catch(err){
        throw err
    }
    
}
