const express=require('express')
const {getAllUsers,createUser,getUser,editUser, deleteUser, fetchToken} = require('../controllers/userController')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const router=express.Router()

router.route('/').get(checkToken,checkRole,getAllUsers).post(checkToken,checkRole,createUser)

router.route('/:employee_id').get(checkToken,getUser).put(checkToken,checkRole,editUser).delete(checkToken,checkRole,deleteUser)

router.route('/login').post(fetchToken)

module.exports=router


