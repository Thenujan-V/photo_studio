import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

export const fetchServicesByCategoryId = async (serviceCategoryId) => {    
    if(!serviceCategoryId){
        throw new Error('category id cannot be null.')
    }

    try{
        const response = await axios.get(`${API_BASE_URL}/services/fetch-services/${serviceCategoryId}`)
        console.log('respo :', response)
        return response

    }catch(err){
        throw err
    }
    
}

// export const addServices = async () => {    
//     if(!serviceCategoryId){
//         throw new Error('category id cannot be null.')
//     }

//     try{
//         const response = await axios.get(`${API_BASE_URL}/services/fetch-services/${serviceCategoryId}`)
//         console.log('respo :', response)
//         return response

//     }catch(err){
//         throw err
//     }
    
// }