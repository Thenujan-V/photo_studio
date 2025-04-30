const mysql = require('mysql2')
const env = require('dotenv').config();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'photo_studio'
})

db.connect((err) => {
    if(err){
        console.err('Database connection faild.', err.stack)
        return
    }
    console.log('Connected to mySQL database.')
})

module.exports = db