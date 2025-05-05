import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const signupService = async (formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/client/client-register`, formData)
        console.log(response);
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
        console.log(response.data)
        return response.data
    }
    catch(error){
        throw error
        
    }
}
// export const userDetails = async (id) => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/customers/userdetails/${id}`)
//         return response.data[0]
//     }
//     catch(error){
//         throw(error)
//     }
// }

// export const updateUserProfile = async (formData, id) => {
//     try{
//         const response = await axios.post(`${API_BASE_URL}/customers/updatedetails/${id}`,formData)
//         return response.data
//     }
//     catch(error){
//         throw(error)
//     }
// }

// export const showAllUsers = async () => {
//     try{
//         const response = await axios.get(`${API_BASE_URL}/customers/getusers`)
//         return response.data
//     }
//     catch(error){
//         throw error
//     }
// }

// export const deleteAccount = async (user_id) => {
//     try{
//         const response = await axios.delete(`${API_BASE_URL}/customers/deleteuser/${user_id}`)
//         return response.data
//     }
//     catch(error){
//         throw error
//     }
// }