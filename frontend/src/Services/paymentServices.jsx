import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const createPayment = async (formData) => {
    const { orderId, clientId, totalAmount, paymentMethod, status } = formData
    if (!clientId || !orderId || !totalAmount || !paymentMethod || !status) {
        throw new Error("Missing required payment data.");
    }

    try{
        const response = await axios.post(`${API_BASE_URL}/payment/create-payment`,formData,
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

export const getAllPayments = async () => {
    try{
        const response = await axios.post(`${API_BASE_URL}/payment/get-all-payments`,
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

export const updateStatus = async (paymentId, status) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/payment//status-update/${paymentId}`, status,
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