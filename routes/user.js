const express=require('express')
const {getAllUsers,createUser,getUser,editUser, deleteUser, fetchToken, fetchOtp, verifyOtp, changePassword} = require('../controllers/userController')
const { checkRole, checkAdmin } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const routers=express.Router()

routers.route('/').get(checkToken,checkAdmin,getAllUsers).post(checkToken,checkAdmin,createUser)

routers.route('/:employee_id').get(checkToken,getUser).put(checkToken,checkAdmin,editUser).delete(checkToken,checkAdmin,deleteUser)

routers.route('/login').post(fetchToken)

routers.route('/otp').post(fetchOtp);

routers.route('/verify').post(verifyOtp)

routers.route('/changepass').post(changePassword)

module.exports=routers


