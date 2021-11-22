const jwt=require('jsonwebtoken')

const checkToken=(req,res,next)=>{
    try{
        const user={
            employee_id:"id",
            role:"admin"
        }
        const token=req.headers.authorization.split(" ")[1]
        const tokens=jwt.verify(token,"SECRET KEY")
        const decoded=jwt.decode(tokens)
        req.user={
            employee_id:decoded.employee_id,
            role:decoded.role}
        next()
    }catch(err){
        return res.status(404).json({message:"Auth failed"})
    }
}

module.exports=checkToken