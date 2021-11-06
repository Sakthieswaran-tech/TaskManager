const mysql=require('mysql2')

const con=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"Sakthi17",
    database:"TaskManager"
})

con.connect(function(err){
    if(err) console.log(err);
    else{
        con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,employee_id VARCHAR(50) NOT NULL ,employee_reg_no VARCHAR(50) NOT NULL,employee_name VARCHAR(50) NOT NULL,password VARCHAR(100) NOT NULL,email VARCHAR(30) NOT NULL,role VARCHAR(20),UNIQUE(employee_id))",(err)=>{
            if(err) console.log(err);
            else console.log("Connected");
        })
        con.query("CREATE TABLE tasks (id INT AUTO_INCREMENT PRIMARY KEY,task_name VARCHAR(100) NOT NULL,taskID VARCHAR(50) NOT NULL,depending_task VARCHAR(100),created_by VARCHAR(50) NOT NULL,created_at TIME NOT NULL,start_time TIME,completed_at TIME ,isCompleted BOOLEAN NOT NULL,CONSTRAINT creater_of_task FOREIGN KEY (created_by) REFERENCES users(employee_id) ON DELETE CASCADE ON UPDATE CASCADE)",(err)=>{
            if(err) console.log(err);
            else console.log("Connected");
        })
    }
})