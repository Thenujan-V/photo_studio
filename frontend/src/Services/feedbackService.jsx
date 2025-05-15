import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL


export const createFeedbacks = async (clientId, feedBackForm) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/feedback/create-feedback/${clientId}`, feedBackForm)
        return response
    }catch(err){
        throw err
    }
    
}

export const showAllFeedbacks = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/feedback/get-feedbacks`)
        return response
    }catch(err){
        throw err
    }
    
}

export const sendReplyForFeedback = async (id, replyMsg) => {
    const msgData = { replyMsg: replyMsg}
    try{
        const response = await axios.patch(`${API_BASE_URL}/feedback/reply-msg/${id}`, msgData)
        return response
    }catch(err){
        throw err
    }
    
}


export const deleteFeedback = async (id) => {
    try{
        const response = await axios.delete(`${API_BASE_URL}/feedback/delete-feedback/${id}`)
        return response
    }catch(err){
        throw err
    }
    
}

