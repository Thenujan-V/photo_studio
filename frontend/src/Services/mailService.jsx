import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const sendMailToClient = async (mailData) => {
console.log("maildata :", mailData)
    try{
        const response = await axios.post(`${API_BASE_URL}/email/send-mail`, mailData)
        return response
    }catch(err){
        throw err
    }
    
}