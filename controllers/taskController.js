const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const checkToken = require('../middleware/jwt')
require('dotenv').config()

const con=mysql.createConnection({
    host:LOCALHOST,
    user:USERNAME,
    password:PASSWORD,
    database:DATABASE
})

const getAllTask=(req,res)=>{
    const sql="SELECT * FROM tasks ORDER BY id DESC"
    con.query(sql,(err,result,fields)=>{
        if(err) return res.status(500).json({error:err})
        else return res.status(200).json({tasks:result})
    })
}

const createTask=(req,res)=>{
    var created=new Date()
    var date=created.getFullYear()+'-'+created.getMonth()+'-'+created.getDate()
    var time=created.getHours()+':'+created.getMinutes()+'-'+created.getSeconds()
    var dateTime = date +" "+time
    const sql="INSERT INTO tasks(task_name,taskID,depending_task,created_by,created_at,start_time,completed_at,isCompleted) VALUE(?,?,?,?,?,?,?,?)"
    con.query(sql,[req.body.task_name,req.body.taskID,req.body.depending_task,req.user.employee_id,dateTime,null,null,false],(err,result,fields)=>{
        if(err) return res.status(500).json({error:err})
        else return res.status(201).json({message:"Task created"})
    })
}

const updateTask=(req,res)=>{
    const sql1="SELECT * FROM tasks WHERE taskID=?"
    con.query(sql1,[req.params.taskID],(err,result,field)=>{
        if(err) return res.status(500).json({error:err})
        if(result.length>0){
            var created=new Date()
            var date=created.getFullYear()+'-'+created.getMonth()+'-'+created.getDate()
            var time=created.getHours()+':'+created.getMinutes()+'-'+created.getSeconds()
            var dateTime = date +" "+time
            const sql2="UPDATE tasks SET start_time=? ,completed_at=?, isCompleted=? WHERE taskID=?"
            con.query(sql2,[req.body.start_time,req.body.completed_at,req.body.isCompleted,req.params.taskID],(error,resp,field)=>{
                if(error) {
                    console.log(error)
                    return res.status(500).json({error:error})}
                else return res.status(200).json({message:"Updated successfuly"})
            })
        }
        else{
            return res.status(404).json({message:"No task found with given ID"})
        }
    })
}

const getTask=(req,res)=>{
    const sql="SELECT* FROM tasks WHERE taskID=?"
    con.query(sql,[req.params.taskID],(err,result,field)=>{
        if(err) return res.status(500).json({error:err})
        if(result.length<1){
            return res.status(404).json({user:"No task found with given task ID"})
        }
        else{
            console.log(result);
            return res.status(200).json({tasks:result})
        }
    })
}

const completeTask=(req,res)=>{
    const sql1="SELECT * FROM tasks WHERE taskID=?"
    con.query(
        sql1,[req.params.taskID],(err,result,field)=>
        {
        if(err) return res.status(500).json({error:err})
        if(result.length>0)
        {
            var created=new Date()
            var date=created.getFullYear()+'-'+created.getMonth()+'-'+created.getDate()
            var time=created.getHours()+':'+created.getMinutes()+'-'+created.getSeconds()
            var dateTime = date +" "+time
            const sql2="UPDATE tasks SET completed_at=?, isCompleted=? WHERE taskID=?"
            con.query(
                sql2,[dateTime,req.body.isCompleted,req.params.taskID],(error,resp,field)=>
                {
                if(error)
                {
                    console.log(error)
                    return res.status(500).json({error:error})
                }
                else return res.status(200).json({message:"Updated successfuly"})
            }
            )
        }
        })
    }

const deleteTask=(req,res)=>{
    const sql="DELETE FROM tasks WHERE taskID=?"
    con.query(sql,[req.params.taskID],(err,result)=>{
        if(err) return res.status(500).json({error:err})
        else return res.status(200).json({message:"task deleted"})
    })
}

module.exports ={
    getAllTask,
    createTask,
    updateTask,
    getTask,
    deleteTask,
    completeTask
}