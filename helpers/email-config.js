const nodemailer=require("nodemailer");

let mailconnect=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    service:"Gmail",
    auth:{
        user:EMAIL,
        pass:PASSWORD
    }
})

module.exports=mailconnect