import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const getInquiry = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/inquiry/get-inquiry`)
        return response
    }catch(err){
        throw err
    }
    
}