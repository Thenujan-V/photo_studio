const db = require('../config/db')

const createOrder = (client_id) => {
    const sql = 'insert into orders ( client_id ) values ( ? )'

    return new Promise((resolve, reject) => {
        db.query(sql, [client_id],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const createOrderDetails = (orderDetails) => {
    const { order_id, service_category_id, service_id, quantity } = orderDetails

    const sql = 'insert into order_details ( order_id, service_category_id, service_id, quantity ) values ( ?, ?, ?, ? )'

    return new Promise((resolve, reject) => {
        db.query(sql, [order_id, service_category_id, service_id, quantity],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const addClientsPhotosForOrders = (photosData) => {
    const { file_paths, orderDetailsId } = photosData

    const values = file_paths.map(file => [orderDetailsId, file])

    const placeHolder = values.map(() => '(?, ?)').join(', ')

    const sql = `insert into client_photos_for_orders ( order_details_id, file_path ) values ${placeHolder}`

    const flattenedValues = values.flat();

    return new Promise((resolve, reject) => {
        db.query(sql, flattenedValues,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const orderFetchByClientId = (clientId) => {
    const sql = `select 
                    o.id as order_id,
                    o.client_id as client_id,
                    od.id as order_details_id,
                    od.service_category_id,
                    od.service_id,
                    od.quantity,
                    od.status,
                    od.created_at,
                    JSON_ARRAYAGG(p.file_path) As photosPaths
                    from orders o 
                    join order_details od on o.id = od.order_id 
                    left join client_photos_for_orders p on od.id = p.order_details_id 
                    where o.client_id = ?
                    group by o.id, o.client_id, od.id, od.service_category_id, od.service_id, od.quantity, od.status, od.created_at`

    return new Promise((resolve, reject) => {
        db.query(sql, [clientId],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

















module.exports = { createOrder, createOrderDetails, addClientsPhotosForOrders, orderFetchByClientId }