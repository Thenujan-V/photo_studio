const db = require('../config/db')

const feedBackCreate = (feedbackData) => {
    console.log("fbd :", feedbackData)
    const { feedback, rating, clientId } = feedbackData

    const sql = `insert into feedback (feedback, rating, client_id) values (?, ?, ?)`

    return new Promise((resolve, reject) => {
        db.query(sql, [ feedback, rating, clientId ], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}   

const fetchFeedBacks = () => {
    const sql = `select 
                    c.username,
                    c.mail,
                    f.feedback,
                    f.rating,
                    f.reply_msg,
                    f.id,
                    f.created_at
                    from feedback f join client c on f.client_id = c.id`

    return new Promise((resolve, reject) => {
        db.query(sql, 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}   

const deleteFeedback = (id) => {
    const sql = `delete from feedback where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}   

const giveReply = (id, replyMsg) => {
    const sql = `update feedback set reply_msg = ? where id = ?`

    return new Promise((resolve, reject) => {
        db.query(sql, [replyMsg, id], 
            (err, result) => {
                if(err) reject(err)
                    else resolve(result)
            }
        )
    })
}   




module.exports = { feedBackCreate, fetchFeedBacks, deleteFeedback, giveReply }