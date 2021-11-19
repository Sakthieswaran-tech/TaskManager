const mysql = require('mysql2/promise')
require('dotenv').config()

let connection;
const getConnection = async () => {
    if(!connection) {
        connection = await mysql.createConnection({
            host: process.env.mysql_host,
            user: process.env.mysql_user,
            password: process.env.mysql_password,
            database: process.env.mysql_database,
            port: process.env.mysql_port
        })
    }
    return connection
}


module.exports.connection = getConnection
module.exports.connectToDatabase = getConnection