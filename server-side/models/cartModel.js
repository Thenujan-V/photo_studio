const db = require('../config/db')

const findByCartId =  (id) => {
    const sql = `select * from cart where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByClientId = (id) => {
    const sql = `select * from cart where client_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByCategoryId = (id) => {
    const sql = `select * from cart where service_category_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findByServiceId = (id) => {
    const sql = `select * from cart where service_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const cartCreate = (cartData) => {
    const {clientId, categoryId, serviceId} = cartData
    const sql = `insert into cart (service_category_id, service_id, client_id) 
                    values (?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [categoryId, serviceId, clientId], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const findAllByClientId = (id) => {
    const sql = `select 
                    c.id as cartId,
                    c.service_category_id as serviceCategoryId,
                    c.service_id as serviceId,
                    c.quantity as quantity,
                    c.client_id as clientId
                    from cart c  where client_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
            }
        )
    })
}

const findCart = (cartDetails) => {
    const { clientId, categoryId, serviceId } = cartDetails
    const sql = `select * from cart where client_id = ? and service_category_id = ? and service_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [clientId, categoryId, serviceId], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
            }
        )
    })
}

const editQuantity = (id, quantity) => {
    const sql = `update cart set quantity = ? where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [quantity, id], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
            }
        )
    })
}

const cartDetelet = (id) => {
    const sql = `delete from cart where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
            }
        )
    })
} 

const cartDeleteByClientId = (id) => {
    const sql = `delete from cart where client_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
            }
        )
    })
} 


module.exports = {findByCartId, cartCreate, findByCategoryId, findByClientId, findCart, findByServiceId, findAllByClientId, editQuantity, cartDetelet, cartDeleteByClientId}