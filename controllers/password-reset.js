const mailconnect = require('../helpers/email-config')
const { userdb } = require('../helpers/db')
const bcrypt=require('bcrypt')

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
                from:"mail",
                to:email,
                subject:"otp ",
                html:"<h3>OTP FOR account </h3>"+otp
            }
            mailconnect.sendMail(mailOptions,(err,info)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json(err);
                }else{
                    console.log("Message sent %s",info.messageId);
                    console.log("Preview url %s",nodemailer.getTestMessageUrl(info));
                }
            })
            return res.status(200).json({message:"Otp send",otp:otp})
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
    fetchOtp,
    verifyOtp,
    changePassword
}