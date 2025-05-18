import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const storeInvoiceToDB = async (orderId, formData) => {
    console.log(orderId, formData)
    try{
        const response = await axios.post(`${API_BASE_URL}/invoice/store/${orderId}`,formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        return response
    }catch(err){
        throw err
    }
}

export const fetchInvoice = async (orderId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/invoice/view/${orderId}`)
        return response
    }catch(err){
        throw err
    }
}