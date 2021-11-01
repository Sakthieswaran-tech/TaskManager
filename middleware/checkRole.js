const checkRole=(req,res,next)=>{
    console.log(req.user.role);
        if(req.user.role!=="admin")
            return res.status(403).json({message:"Not allowed"})
        next()
}

module.exports={
    checkRole
}