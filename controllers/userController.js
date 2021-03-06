const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const checkToken = require('../middleware/jwt')
const { userdb } = require('../helpers/db')
require('dotenv').config()

// const nodemailer=require("nodemailer")
// var otp;

const getAllUsers=async(req,res)=>{
    const con=await userdb()
    const sql="SELECT * FROM users ORDER BY employee_name"
    con.query(sql,(err,result,field)=>{
        if(err) return res.status(500).json({error:err})
        else return res.status(200).json({user:result})
        }
    )
}

const createUser=async(req,res)=>{
    const con=await userdb()
    const detail=req.body
    bcrypt.hash(detail.password,5,(err,hash)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized"})
        }
        else{
            const sql="INSERT INTO users (employee_id,employee_reg_no,employee_name,password,email,role) VALUE(?,?,?,?,?,?)"
            con.query(sql,[detail.employee_id,detail.employee_reg_no,detail.employee_name,hash,detail.email,detail.role],(err,result,field)=>{
                if(err) return res.status(500).json({error:err})
                else {
                    console.log(result)
                    return res.status(201).json({message:"user created"})
                }
            })
        }
    })   
}

const getUser=async(req,res)=>{
    const con=await userdb()
    const sql="SELECT* FROM users WHERE employee_id=?"
    con.query(sql,[req.params.employee_id],(err,row,field)=>{
        if(err) return res.status(500).json({error:err})
        if(row.length<1){
            return res.status(404).json({user:"No user found with given employee id"})
        }
        else{
            console.log(row);
            return res.status(200).json({user:row})
        }
    })
}

const editUser=async(req,res)=>{
    const con=await userdb()
    const sql="UPDATE users SET employee_reg_no=?,employee_name=?,email=?,role=? WHERE employee_id=?"
    con.query(sql,[req.body.employee_reg_no,req.body.employee_name,req.body.email,req.body.role,req.params.employee_id],(err,result,field)=>{
        if(err) return res.status(500).json({error:err})
        else{
            return res.status(200).json({message:"User details updated"})
        }
    })
}

const deleteUser=async(req,res)=>{
    const con=await userdb()
    const sql="DELETE FROM users WHERE employee_id=?"
    con.query(sql,[req.params.employee_id],(err,result)=>{
        if(err) return res.status(500).json({error:err})
        else return res.status(200).json({message:"user deleted"})
    })
}

const fetchToken=async(req,res)=>{
    let con=await userdb()
    const sql="SELECT * FROM users WHERE employee_id=?"
    con.query(sql,[req.body.employee_id],(err,result,field)=>{
        if(err) {
            console.log(err);
            return res.status(500).json({error:err})
        }
        if(result.length<1) return res.status(404).json({message:"User not found"})
        else{
            console.log(result[0].role);
            bcrypt.compare(req.body.password,result[0].password,(error,resp)=>{
                if(error) {
                    console.log(error);
                    return res.status(500).json({error:error})
                }
                else if(resp){
                    const token=jwt.sign(
                        {
                        employee_id:req.body.employee_id,
                        role:result[0].role
                    },
                        "SECRET KEY")
                    return res.status(200).json({token:token})
                }
                else{
                    return res.status(401).json({message:"Unauthorized"})
                }
            })
        }
    })
}

module.exports={
    getAllUsers,
    createUser,
    getUser,
    editUser,
    deleteUser,
    fetchToken
}