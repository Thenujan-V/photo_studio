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
    const { orderId, serviceCategoryId, serviceId, quantity } = orderDetails

    const sql = 'insert into order_details ( order_id, service_category_id, service_id, quantity ) values ( ?, ?, ?, ? )'

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId, serviceCategoryId, serviceId, quantity],
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

const addEditedPhotosForOrders = (photosData) => {
    const { file_paths, orderDetailsId } = photosData

    const values = file_paths.map(file => [orderDetailsId, file])

    const placeHolder = values.map(() => '(?, ?)').join(', ')

    const sql = `insert into edited_photos ( order_details_id, photo_path ) values ${placeHolder}`

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

const getEditedPhotos = (orderDetailsId) => {
    const sql = `select 
                    o.id as orderId,
                    o.client_id as clientId,
                    od.id as orderDetailsId,
                    od.service_category_id as serviceCategoryId,
                    od.service_id as serviceId,
                    od.quantity,
                    od.status,
                    od.created_at as createdAt,
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


const orderFetchByClientId = (clientId) => {
    const sql = `select 
                    o.id as orderId,
                    o.client_id as clientId,
                    od.id as orderDetailsId,
                    od.service_category_id as serviceCategoryId,
                    od.service_id as serviceId,
                    od.quantity,
                    od.status,
                    od.created_at as createdAt,
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

const fetchAllOrderDetails = () => {
    const sql = `select 
                    o.id as orderId,
                    o.client_id as clientId,
                    c.username,
                    od.id as orderDetailsId,
                    od.service_category_id as serviceCategoryId,
                    od.service_id as serviceId,
                    od.quantity,
                    od.status,
                    od.created_at as createdAt,
                    pd.id as paymentId,
                    pd.total_amount as totalAmount,
                    pd.payment_method as paymentMethod,
                    pd.status as paymentStatus,
                    JSON_ARRAYAGG(p.file_path) As photosPaths
                    from orders o 
                    join order_details od on o.id = od.order_id 
                    left join client_photos_for_orders p on od.id = p.order_details_id 
                    left join client c on c.id = o.client_id
                    left join payment_details pd on o.id = pd.order_id
                    group by o.id, o.client_id, od.id, od.service_category_id, od.service_id, od.quantity, od.status, od.created_at, c.username, pd.id, pd.total_amount, pd.payment_method, pd.status`

    return new Promise((resolve, reject) => {
        db.query(sql,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const deliveryDetailsCreate = (deliveryDetails, orderId) => {
    const { senderPhoneNumber, receiverName, receiverPhoneNumber, receiverDistrict, receiverCity, receiverStreet } = deliveryDetails

    const sql = 'insert into order_delivery_details ( order_id, sender_phone_number, receiver_phone_number, receiver_name, receiver_district, receiver_city, receiver_street ) values ( ?, ?, ?, ?, ?, ?, ? )'

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId, senderPhoneNumber, receiverPhoneNumber, receiverName, receiverDistrict, receiverCity, receiverStreet],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const fetchDetailsForDelivery = (orderId) => {
    const sql = `select o.id as orderId,
                        o.client_id as clientId,
                        c.username as senderName,
                        c.mail as senderMail,
                        c.phone_number as clientPhoneNumber,
                        c.city as senderCity,
                        od.sender_phone_number as senderPhoneNumber,
                        od.receiver_phone_number as receiverPhoneNumber,
                        od.receiver_name as receiverName,
                        od.receiver_district as receiverDistrict,
                        od.receiver_city as receiverCity,
                        od.receiver_street as receiverStreet,
                        od.created_at as orderdDate
                 from order_delivery_details od right join orders o on od.order_id = o.id join client c on o.client_id = c.id where o.id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const fetchOrderDeailsById = (orderDetailsId) => {
    const sql = 'select * from order_details where id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [orderDetailsId],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const editStatus = (status, id) => {
    const sql = `update order_details set status = ? where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [status, id],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const getEditedPhoto = (orderDetailsId) => {
    const sql = `select e.id as id,
                        e.order_details_id as orderDetailsId,
                        e.photo_path as photoPath,
                        e.created_at as createdAt,
                        o.order_id as orderId,
                        o.service_category_id as serviceCategoryId,
                        o.service_id as serviceId
                        from edited_photos e join order_details o on e.order_details_id = o.id 
                        where e.order_details_id = ? group by e.id, e.order_details_id, e.photo_path, o.order_id, o.service_category_id, o.service_id`

    return new Promise((resolve, reject) => {
        db.query(sql, [orderDetailsId],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}






module.exports = {  createOrder, 
                    createOrderDetails, 
                    addClientsPhotosForOrders, 
                    orderFetchByClientId, 
                    deliveryDetailsCreate, 
                    fetchDetailsForDelivery, 
                    editStatus, 
                    fetchOrderDeailsById,
                    fetchAllOrderDetails,
                    addEditedPhotosForOrders,
                    getEditedPhoto
                }