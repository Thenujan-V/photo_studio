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
                    p.payment_method as paymentMethod
                    p.status as paymentStatus,
                    p.created_at as createdAt,
                    o.service_category_id as categoryId,
                    o.service_id as serviceId,
                    o.quantity as quantity
                    c.username as clientName,
                    c.phoneNumber as clientPhoneNumber,
                    c.mail as clientMail
                    from payment_details p join order_details o on p.order_id = o.order_id join client c on c.id = p.client_id group by p.id`

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId, clientId, totalAmount, paymentMethod, status],
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


module.exports = [ paymentDetailsCreate, getPaymentDetails, setPaymentStatus ]


