const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const checkToken = require('../middleware/jwt')
const setUser=require('../middleware/checkRole')
require('dotenv').config()

const con=mysql.createConnection({
    host:"127.0.0.1",
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

const getAllUsers=(req,res)=>{
    try{
    const sql="SELECT * FROM users"
    con.query(sql,(err,result,field)=>{
        if(err) console.log(err);
        else{
            return res.status(200).json({users:result})
        }
    })}
    catch(err){
        console.log(err)
    }
}

const createUser=(req,res)=>{
    const detail=req.body
    bcrypt.hash(detail.password,5,(err,hash)=>{
        if(err){
            console.log(err);
            return
        }
        else{
            const sql="INSERT INTO users (employee_id,employee_reg_no,employee_name,password,email,role) VALUE(?,?,?,?,?,?)"
            con.query(sql,[detail.employee_id,detail.employee_reg_no,detail.employee_name,hash,detail.email,detail.role],(err,result,field)=>{
                if(err) console.log(err);
                else {
                    console.log(result)
                    return res.status(201).json({message:"user created"})
                }
            })
        }
    })   
}

const getUser=(req,res)=>{
    const sql="SELECT* FROM users WHERE employee_id=?"
    con.query(sql,[req.params.employee_id],(err,row,field)=>{
        if(err) console.log(err);
        if(row.length<1){
            return res.status(404).json({user:"No user found with given employee id"})
        }
        else{
            console.log(row);
            return res.status(200).json({user:row})
        }
    })
}

const editUser=(req,res)=>{
    const sql="UPDATE users SET employee_reg_no=?,employee_name=?,email=?,role=? WHERE employee_id=?"
    con.query(sql,[req.body.employee_reg_no,req.body.employee_name,req.body.email,req.body.role,req.params.employee_id],(err,result,field)=>{
        if(err) console.log(err);
        else{
            return res.status(201).json({message:"User details updated"})
        }
    })
}

const deleteUser=(req,res)=>{
    const sql="DELETE FROM users WHERE employee_id=?"
    con.query(sql,[req.params.employee_id],(err,result)=>{
        if(err) console.log(err);
        else return res.status(200).json({message:"user deleted"})
    })
}

const fetchToken=(req,res)=>{
    const sql="SELECT * FROM users WHERE employee_id=?"
    con.query(sql,[req.body.employee_id],(err,result,field)=>{
        if(err) console.log(err);
        if(result.length<1) return res.status(404).json({message:"User not found"})
        else{
            console.log(result[0].role);
            setRoles(result[0].role)
            bcrypt.compare(req.body.password,result[0].password,(err,resp)=>{
                if(err) return res.status(401).json({message:"Unauthorized"})
                else{
                    const token=jwt.sign(
                        {
                        employee_id:req.body.employee_id,
                        role:result[0].role
                    },
                        "SECRET KEY")
                    return res.status(200).json({token:token})
                }
            })
        }
    })
}

function setRoles(role){
    userRoles=role
    console.log(userRoles);
}

module.exports={
    getAllUsers,
    createUser,
    getUser,
    editUser,
    deleteUser,
    fetchToken,
}