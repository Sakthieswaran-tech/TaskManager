const express=require('express')
const {getAllUsers,createUser,getUser,editUser, deleteUser, fetchToken} = require('../controllers/userController')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const routers=express.Router()

routers.route('/').get(checkToken,checkRole,getAllUsers).post(checkToken,checkRole,createUser)

routers.route('/:employee_id').get(checkToken,getUser).put(checkToken,checkRole,editUser).delete(checkToken,checkRole,deleteUser)

routers.route('/login').post(fetchToken)

module.exports=routers


