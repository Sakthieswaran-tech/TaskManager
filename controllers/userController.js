const mysql=require('mysql2')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const checkToken = require('../middleware/jwt')
require('dotenv').config()
const {userdb, connection}=require('../helpers/db')
const nodemailer=require("nodemailer")
const mailconnect = require('../helpers/email-config')
var otp;

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
    const con=await userdb()
    const sql="SELECT * FROM users WHERE employee_id=?"
    con.query(sql,[req.body.employee_id],(err,result,field)=>{
        if(err) return res.status(500).json({error:err})
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
const fetchOtp=async(req,res)=>{
    let db=await userdb();
    const {employee_id,email}=req.body;
    console.log(employee_id+" "+email);
    const sql="SELECT * FROM users WHERE employee_id=? AND email=?";
    db.query(sql,[employee_id,email],(err,result,field)=>{
        if(err){
            console.log(err);
            return res.status(500).json(err);
        }
        else if(result.length<1){
            console.log(result);
            return res.status(404).json("User not found");
        }else{

            otp=Math.random();
            otp=otp*100000;
            otp=parseInt(otp);
            console.log(otp);

            var mailOptions={
                from:"sakthichunkz17@gmail.com",
                to:email,
                subject:"otp ",
                html:"<h3>OTP FOR account </h3>"+otp
            }
            mailconnect.sendMail(mailOptions,(err,info)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Message sent %s",info.messageId);
                    console.log("Preview url %s",nodemailer.getTestMessageUrl(info));
                    return res.status(200).json({message:"Otp send",otp:otp})
                }
            })
        }
    })
}

const verifyOtp=(req,res)=>{
    if(otp==req.body.otp){
        return res.status(200).json({message:"Otp verified"})
    }else{
        return res.status(401).json({message:"Otp not verified"})
    }
}

const changePassword=async(req,res)=>{
    let db=await userdb();
    const {password,employee_id}=req.body;
    bcrypt.hash(password,5,(err,hash)=>{
        if(err){
            return res.status(401).json({message:err})
        }
        else{
            const sql="UPDATE users SET password=? WHERE employee_id=?"
            db.query(sql,[hash,employee_id],(err,result,field)=>{
                if(err) return res.status(500).json({error:err})
                else {
                    console.log(result)
                    return res.status(201).json({message:"Password updated"})
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
    fetchToken,
    fetchOtp,
    verifyOtp,
    changePassword
}