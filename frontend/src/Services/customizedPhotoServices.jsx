import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


export const uploadEditedPhoto = async (orderDetailsId, formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/orders/add-edited-photos/${orderDetailsId}`, formData)
        return response
    }catch(err){
        throw err
    }
    
}

export const viewEditedPhoto = async (orderDetailsId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/orders/view-edited-photo/${orderDetailsId}`)
        return response
    }catch(err){
        throw err
    }
    
}

