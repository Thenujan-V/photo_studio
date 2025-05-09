const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET
const jwttoken = ({ id, username, role }) =>  {
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