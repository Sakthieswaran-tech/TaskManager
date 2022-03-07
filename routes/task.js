const express = require('express')
const { getAllTasks, createNewTask, getTaskById, completeTask, deleteTask, startTask, getTaskByRole, getTasksByGroup, getCurrentTask, getRangeTasks, getTaskByRoleAndStatus, getByRole, getByDatesOnly } = require('../controllers/taskControllerV2')
const { checkRole } = require('../middleware/checkRole')
const checkToken = require('../middleware/jwt')
const router = express.Router()

router.route('/').get(checkToken, getAllTasks).post(checkToken,createNewTask)


router.route('/filter').get(checkToken,getTaskByRoleAndStatus)

router.route('/group').get(getTasksByGroup)

router.route('/current').get(checkToken,getCurrentTask);

router.route('/filter_for_admin').get(getRangeTasks);

router.route('/filter_for_admin_by_role').get(getByRole);

router.route('/:taskID').get(checkToken,getTaskById).delete(checkToken,deleteTask);

router.route('/filter_by_dates_only').get(getByDatesOnly);

router.route('/:taskID/complete').patch(checkToken,completeTask);

router.route('/:taskID/start').patch(checkToken,startTask);


module.exports = router
