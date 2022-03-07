const express=require('express')
const { fetchOtp, verifyOtp, changePassword } = require('../controllers/password-reset')
const {getAllUsers,createUser,getUser,editUser, deleteUser, fetchToken} = require('../controllers/userController')
const { checkRole, checkAdmin } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const routers=express.Router()

routers.route('/').get(checkToken,checkAdmin,getAllUsers).post(checkToken,checkAdmin,createUser)

routers.route('/:employee_id').get(checkToken,getUser).put(checkToken,checkAdmin,editUser).delete(checkToken,checkAdmin,deleteUser)

routers.route('/login').post(fetchToken)

routers.route('/createOtp').post(fetchOtp);

routers.route('/verifyOtp').post(verifyOtp)

routers.route('/changepassword').post(changePassword)

module.exports=routers


