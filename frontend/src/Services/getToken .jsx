import { jwtDecode } from 'jwt-decode';


export const getToken = () => {
    try{
        const token = localStorage.getItem("authToken")   

        const decodedToken = jwtDecode(token)

        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && currentTime > decodedToken.exp) {
            localStorage.removeItem("authToken");
            return null;
        } 
        else {
            return token;
        }
    }
    catch(error){
        console.log('Error getting token: ', error)
        return null
    }
} 

export const retrieveId = () => {
    try{
        const token = localStorage.getItem("authToken")   
        if(token){
            const decodedToken = jwtDecode(token)
            console.log(decodedToken)
            return decodedToken 
        }
        else{
            return null
        }
    }
    catch(error){
        console.log('Error getting token: ', error)
        throw error
    }
}

export const logout = () => {
    localStorage.removeItem("authToken")
}