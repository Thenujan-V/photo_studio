const jwt = require('jsonwebtoken');
const env = require('dotenv').config

const secretKey = process.env.JWT_SECRET

const jwttoken = (payloads) =>  {
    const {id, username, role} = payloads

    return jwt.sign(
        { userId: id, username: username, role: role }, 
        secretKey, 
        { expiresIn: '1h' }
    );
}

const verifyToken = (jwtToken) => {
    return jwt.verify(jwtToken, secretKey)
}   

module.exports = { jwttoken, verifyToken }