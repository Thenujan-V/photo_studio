import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const signupService = async (formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/client/client-register`, formData)
        return response.data
    }
    catch(err){
        throw err
    }
}
export const signinService = async (mail, password) => {
    try{
        const requestData = {
            mail : mail,
            password : password
        }
       
        const response = await axios.post(`${API_BASE_URL}/client/client-login`, requestData)
        return response.data
    }
    catch(error){
        throw error
        
    }
}

export const userDetails = async (id) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/client/get-client/${id}`)
        console.log("res",response.data);
        return response.data
    }
    catch(error){
        throw(error)
    }
}

export const updateUserProfile = async (formData, id) => {
    try{
        const response = await axios.put(`${API_BASE_URL}/client/edit-details/${id}`,formData)
        return response.data
    }
    catch(error){
        throw(error)
    }
}

export const showAllUsers = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/client/get-all-client`)
        return response.data
    }
    catch(error){
        throw error
    }
}

export const deleteAccount = async (id) => {
    try{
        const response = await axios.delete(`${API_BASE_URL}/client/delete-client/${id}`)
        return response
    }
    catch(error){
        throw error
    }
}