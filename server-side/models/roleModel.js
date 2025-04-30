const db = require('../config/db')

const getRoleIdByname = (roleName) => {
    return new Promise((resolve, reject) => {
        sql = `select id from role where role = ?`

        db.query(sql, [roleName], (err, result) => {
            if(err){
                reject(err)
            }
            else{
                resolve(result[0])
            }
        })
    })
}

const getRoleById = (role_id) => {
    return new Promise((resolve, reject) => {
        sql = `select role from role where id = ?`
        db.query(sql, [role_id], (err, result) => {
            if(err) reject(err)
            else resolve(result[0])
        })
    })
}


module.exports = { getRoleById, getRoleIdByname}