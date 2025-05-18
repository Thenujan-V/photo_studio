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

export const editServices = async (serviceCategoryId, serviceId, updateData) => {    
    if(!serviceCategoryId && !serviceId){
        throw new Error('category id and serviceId cannot be null.')
    }

    try{
        const response = await axios.patch(`${API_BASE_URL}/services/edit-services/${serviceCategoryId}/${serviceId}`, updateData)
        return response

    }catch(err){
        throw err
    }  
}

export const fetchserviceCategory = async () => {    

    try{
        const response = await axios.get(`${API_BASE_URL}/services/fetch-all-category`)
        console.log('respo :', response)
        return response

    }catch(err){
        throw err
    } 
}

export const addServices = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/services/add-services`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};