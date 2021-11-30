const mysql=require('mysql2')

const con=mysql.createConnection({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE
})


con.connect(function (err) {
    // if (err) console.log(err);
    // else {
    //     con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,employee_id VARCHAR(50) NOT NULL ,employee_reg_no VARCHAR(50) NOT NULL,employee_name VARCHAR(50) NOT NULL,password VARCHAR(100) NOT NULL,email VARCHAR(30) NOT NULL,role VARCHAR(20),UNIQUE(employee_id))", (err) => {
    //         if (err) console.log(err);
    //         else console.log("Connected");
    //     })
    //     con.query("CREATE TABLE tasks (id INT AUTO_INCREMENT PRIMARY KEY,task_name VARCHAR(100) NOT NULL,depending_task VARCHAR(100),created_by VARCHAR(50) NOT NULL,created_at DATETIME NOT NULL,start_time DATETIME,completed_at DATETIME ,isCompleted BOOLEAN NOT NULL,CONSTRAINT creater_of_task FOREIGN KEY (created_by) REFERENCES users(employee_id) ON DELETE CASCADE ON UPDATE CASCADE,taskID VARCHAR(50),assigned_to VARCHAR(50))", (err) => {
    //         if (err) console.log(err);
    //         else console.log("Connected");
    //     })
    //     con.query(`
    //     CREATE TABLE dependent_tasks (parent_task_id INT,
    //     dependent_task_id INT,
    //     CONSTRAINT dependent_tasks_parent_task_to_tasks_foreign_key FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    //     CONSTRAINT dependent_tasks_dependent_task_id_to_tasks_foreign_key FOREIGN KEY (dependent_task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE)
    //     `, (err) => {
    //         if (err) console.log(err);
    //         else console.log("Connected");
    //     })
    //     con.query("DROP TABLE tasks",(err)=>{
    //         if(err) console.log(err)
    //         else console.log("Done")
    //     })
    //     con.query("CREATE TABLE roles (id INT AUTO_INCREMENT PRIMARY KEY,role VARCHAR(100) NOT NULL",(err)=>{
    //         if(err) console.log(err);
    //         else console.log("Created");
    //     })
    // }
    con.query("ALTER TABLE tasks ADD COLUMN frequency int",(err)=>{
        if(err) console.log(err);
        else console.log("Created");
    })
})