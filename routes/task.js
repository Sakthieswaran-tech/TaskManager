const express=require('express')
const { getAllTask, createTask, updateTask, deleteTask, getTask } = require('../controllers/taskController')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const router=express.Router()

router.route('/').get(checkToken,getAllTask).post(checkToken,checkRole,createTask)
router.route('/:taskID').patch(checkToken,updateTask).get(checkToken,getTask).delete(checkToken,checkRole,deleteTask)

module.exports=router