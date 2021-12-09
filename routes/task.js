const express = require('express')
const { getAllTasks, createNewTask, getTaskById, completeTask, deleteTask, startTask, getTaskByRole, getTasksByGroup } = require('../controllers/taskControllerV2')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const router = express.Router()

router.route('/').get(checkToken, getAllTasks).post(checkToken, checkRole, createNewTask)

router.route('/filter').get(checkToken,getTaskByRole)

router.route('/group').get(checkToken,getTasksByGroup)

router.route('/:taskID').get(checkToken,getTaskById).delete(checkToken,checkRole,deleteTask)

router.route('/:taskID/complete').patch(checkToken,completeTask)

router.route('/:taskID/start').patch(checkToken,startTask)

module.exports = router
