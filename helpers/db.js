const mysql = require('mysql2/promise')
const sql=require('mysql2')
require('dotenv').config()

let connection;
let userConnect;
const getConnection =  () => {
    if(!connection) {
        connection =  mysql.createConnection({
            host: LOCALHOST,
            user: USERNAME,
            password: PASSWORD,
            database: DATABASE,
        })
    }
    return connection
}

let roleConnect;
const getRoleConnection=()=>{
    if(!roleConnect){
        roleConnect =  mysql.createConnection({
            host: LOCALHOST,
            user: USERNAME,
            password: PASSWORD,
            database: DATABASE,
        })
    }
    return roleConnect
}

const userConnection=async()=>{
    if(!userConnect){
        userConnect= await sql.createConnection({
            host: LOCALHOST,
            user: USERNAME,
            password: PASSWORD,
            database: DATABASE,
        })
    }
    return userConnect
}

module.exports.userdb=userConnection
module.exports.roledb=getRoleConnection
module.exports.connection = getConnection
module.exports.connectToDatabase = getConnection