const db = require("../config/db")

const saveInquiry = (inquiryData) => {
    const {  userName, mail, inquiryMsg } = inquiryData

    const sql = `insert into inquiries ( user_name, mail, inquiry_msg ) values (?, ?, ?)`

    return new Promise ((resolve, reject) => {
        db.query(sql, [ userName, mail, inquiryMsg ], 
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
        })
    })
}

const getInquiries = () => {
    const sql = `select * from inquiries`

    return new Promise ((resolve, reject) => {
        db.query(sql,
            (err, result) => {
            if(err) reject(err)
                else resolve(result)
        })
    })
}





module.exports = { saveInquiry, getInquiries }