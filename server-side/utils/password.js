const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

const comparePassword = async (plainPassword, hashedpassword) => {
    return await bcrypt.compare(plainPassword, hashedpassword)
}


module.exports = { hashPassword, comparePassword }
