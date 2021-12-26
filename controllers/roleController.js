const { roledb } = require("../helpers/db")


const createNewRole=async(req,res)=>{
    try{
    let db=await roledb()
    const {role}=req.body
    const sql="INSERT INTO roles(role) value(?)"
    const [row,_]=await db.query(sql,[role])
    return res.status(201).json({message:"role created"})
    }catch(error){
        console.log(error);
    }
    
}

const getAllRoles=async(req,res)=>{
    try{
    let db=await roledb()
    const sql="SELECT * FROM roles ORDER BY role"

    const [rows,fields]=await db.query(sql)
    return res.status(200).json({roles:rows})
    }catch(error){
        console.log(error);
    }
}

const removeRole=async(req,res)=>{
    try{
        let db=await roledb()
        const sql= "DELETE FROM roles WHERE id=?"
        const [row,_]=await db.query(sql,[Number.parseInt(req.params.id)])
        return res.status(200).json({message:"role removed"})
    }
    catch(error){
        console.log(error);
    }
}

module.exports={
    createNewRole,
    getAllRoles,
    removeRole
}