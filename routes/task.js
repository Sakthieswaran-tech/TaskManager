const express = require('express')
const { getAllTasks, createNewTask, getTaskById, completeTask, deleteTask } = require('../controllers/taskControllerV2')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const router = express.Router()

router.route('/').get(checkToken, getAllTasks).post(checkToken, checkRole, createNewTask)
// router.route('/:taskID').patch(checkToken,updateTask).get(checkToken,getTask).delete(checkToken,checkRole,deleteTask)
router.route('/:taskID').get(checkToken,getTaskById).delete(checkToken,checkRole,deleteTask)
router.route('/:taskID/complete').patch(checkToken, completeTask)
module.exports = router
