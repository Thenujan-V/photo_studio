const db = require('../config/db')

const clientRegister = (clientData, role_id) => {
    const {username, mail, phone_number, city, password} = clientData
    const sql = `insert into client (username, mail, phone_number, city, password, role_id) 
                    values (?, ?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [username, mail, phone_number, city, password, role_id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByUserName = async (username) => {
    try{
        const sql = `select * from client where username = ?`

        return new Promise((resolve, reject) => {
            db.query(sql, [username],
                (err, result) => {
                    if(err) reject(err)
                        else resolve(result)
                }
            )
        })
    }catch(err){
        throw new Error('Database error occurred when finding client.');
    }
}

const findByClientId = async (id) => {
    const sql = `select * from client where id = ?`
    
    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByMail  = async(mail) => {
    const sql = `select * from client where mail = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [mail],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByPhoneNo  = async(phoneNumber) => {
    const sql = `select * from client where phone_number = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [phoneNumber],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findAll = async() => {
    const sql = `select * from client`

    return new Promise((resolve, reject) => {
        db.query(sql,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const clientEdit = async (id, clientData) => {
    const setClauses = [];
    const values = [];

    for(const [key, value] of Object.entries(clientData)){
        setClauses.push(`${key} = ?`)
        values.push(value)
    }

    const sql = `update client set ${setClauses.join(', ')} where id = ?`
    values.push(id)

    return new Promise((resolve, reject) => {
        db.query(sql, values,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const clientDelete = async (id) => {
    const sql = `update client set is_active = false where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, id,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}



module.exports = { clientRegister, findByUserName, findByClientId, findByMail, findByPhoneNo, findAll, clientEdit, clientDelete}