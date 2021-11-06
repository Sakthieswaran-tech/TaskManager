const checkRole=(req,res,next)=>{
        if(req.user.role!=="admin")
            return res.status(403).json({message:"Not allowed"})
        next()
}

module.exports={
    checkRole
}