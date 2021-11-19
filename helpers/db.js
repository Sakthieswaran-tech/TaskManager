const mysql = require('mysql2')
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: process.env.mysql_port
})

module.exports.connection = connection