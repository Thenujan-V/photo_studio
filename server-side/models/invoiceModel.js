const db = require('../config/db')

const findInvoiceByOrderId = (orderId) => {
    const sql = `select i.id as id,
                        i.order_id as orderId, 
                        i.file_path as filePath, 
                        i.created_at as createdAt
                        from invoice i where i.order_id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}

const invoiceAddIntoDB = (orderId, filePath) => {
    console.log("add invoice :", orderId, filePath)
    const sql = `insert into invoice ( order_id, file_path ) values (?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [orderId, filePath],
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}




module.exports = {
    invoiceAddIntoDB,
    findInvoiceByOrderId
}