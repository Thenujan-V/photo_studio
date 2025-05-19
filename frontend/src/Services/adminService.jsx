// import axios from 'axios'

// const API_BASE_URL = 'http://localhost:4000/api'

// export const signupService = async (formData) => {
//     console.log('formdata :',formData)
//     try{
//         const response = await axios.post(`${API_BASE_URL}/admin/register`, formData)
//         console.log(response.data)
//         return response.data
//     }
//     catch(err){
//         throw err
//     }
// }
// export const adminSignin = async (mail, password) => {
//     try{
//         const requestData = {
//             mail : mail,
//             password : password
//         }
       
//         const response = await axios.post(`${API_BASE_URL}/client/admin-signin`, requestData)
//         return response.data
//     }
//     catch(error){
//         throw error
        
//     }
// }