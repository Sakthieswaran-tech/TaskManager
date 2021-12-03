const checkRole=(req,res,next)=>{
        if(req.user.role!=="admin"  && req.user.role!=="Manager"){
            return res.status(403).json({message:"Not allowed"})
        }
        next()
}

const checkAdmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Only admin is allowed"})
    }
    next()
}

module.exports={
    checkRole,
    checkAdmin
}