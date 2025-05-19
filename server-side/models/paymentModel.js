const db = require('../config/db')

const paymentDetailsCreate = (formData) => {
    const { orderId, clientId, totalAmount, paymentMethod, status} = formData

    const sql = 'insert into payment_details (order_id, client_id, total_amount, payment_method, status) values ( ?, ?, ?, ?, ? )'

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId, clientId, totalAmount, paymentMethod, status],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const getPaymentDetails = () => {
    const sql = `select 
                    p.id as paymentId,
                    p.order_id as orderId,
                    p.client_id as clientId,
                    p.advance_amount as advanceAmount,
                    p.total_amount as totalAmount,
                    p.payment_method as paymentMethod,
                    p.status as paymentStatus,
                    p.created_at as createdAt,
                    o.service_category_id as categoryId,
                    o.service_id as serviceId,
                    o.quantity as quantity,
                    c.username as clientName,
                    c.phone_number as clientPhoneNumber,
                    c.mail as clientMail
                    from payment_details p 
                    join order_details o on p.order_id = o.order_id 
                    join client c on p.client_id = c.id 
                    group by p.id, p.client_id, p.total_amount, p.payment_method, p.status, p.created_at, o.service_category_id, o.service_id, o.quantity, c.username, c.phone_number, c.mail`

    return new Promise((resolve, reject) => {
        db.query(sql,
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const setPaymentStatus = (id, status) => {
    const sql = 'update payment_details set status = ? where id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [status, id],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}


module.exports =  {paymentDetailsCreate, getPaymentDetails, setPaymentStatus}


