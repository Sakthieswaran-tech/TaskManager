const mysql=require('mysql2')

const con=mysql.createConnection({
    host:"127.0.0.1",
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

con.connect(function(err){
    if(err) console.log(err);
    else{
        // con.query("DROP TABLE users",(err)=>{
        //     if(err) console.log(err);
        //     else console.log("Deleted");
        // })
        con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,employee_id VARCHAR(50) NOT NULL ,employee_reg_no VARCHAR(50) NOT NULL,employee_name VARCHAR(50) NOT NULL,password VARCHAR(100) NOT NULL,email VARCHAR(30) NOT NULL,role VARCHAR(20),UNIQUE(employee_id))",(err)=>{
            if(err) console.log(err);
            else console.log("Connected");
        })
    }
})