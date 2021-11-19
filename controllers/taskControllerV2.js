require('dotenv').config()


const { connection } = require('../helpers/db')


// --------- helper functions ----------
const insertDependentTasks = async (parentTaskId, dependentTaskIds) => {
    let db = await connection()

    dependentTaskIds.map(async (v) => {
        const sql = "INSERT INTO dependent_tasks(parent_task_id, dependent_task_id) VALUE (?, ?)"
        await db.query(sql, [parentTaskId, v])
    })
}
const getDependentTasks = async (taskId) => {
    const sql = "SELECT t.* FROM tasks t JOIN dependent_tasks dt ON t.id=dt.dependent_task_id  WHERE dt.parent_task_id=?"
    let db = await connection()

    const [rows, fields] = await db.query(sql, [taskId])
    return rows
}
const getAllTasksService = async () => {
    const sql = "SELECT * FROM tasks ORDER BY id DESC"
    let db = await connection()

    const [rows, fields] = await db.query(sql)
    return rows
}

const getTaskByIdService = async (id) => {
    const sql = "SELECT * FROM tasks WHERE id=?"
    let db = await connection()
    id = parseInt(id, 10)
    const [rows, fields] = await db.query(sql, [id])
    console.log(rows)
    if (rows.length > 0) {
        const task = rows[0]
        task.dependents = await getDependentTasks(id)
        return task
    }
}

const createNewTaskService = async (taskName, taskID, employeeId, dependingTaskIds, createdDateTime) => {
    let db = await connection()

    const sql = "INSERT INTO tasks(task_name,taskID, created_by,created_at,start_time,completed_at,isCompleted) VALUE(?,?,?,?,?,?,?)"
    const [result, _] = await db.query(sql, [taskName, taskID, employeeId, createdDateTime, null, null, false])
    const insertedId = result.insertId
    if (dependingTaskIds && dependingTaskIds.length > 0) {
        await insertDependentTasks(insertedId, dependingTaskIds)
    }
}

const completeTaskService = async (taskId, isCompleted) => {
    const db = connection()

    let created = new Date()
    let date = created.getFullYear() + '-' + created.getMonth() + '-' + created.getDate()
    let time = created.getHours() + ':' + created.getMinutes() + '-' + created.getSeconds()
    let dateTime = date + " " + time
    const query = "UPDATE tasks SET completed_at=?, isCompleted=? WHERE taskID=?"
    const [result, _] = await db.query(
        query, [dateTime, isCompleted, taskId])

}

const deleteTaskByIdService = async (taskId) => {
    const db = connection()

    taskId = parseInt(taskId, 10)
    const query = "DELETE FROM tasks WHERE id=?"
    db.query(query, [taskId])
}

// --------- Controllers -----------
const getAllTasks = async (req, res) => {
    try {
        tasks = await getAllTasksService()
        res.status(200).json({ tasks: tasks })
        return;
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

const createNewTask = async (req, res) => {
    var created = new Date()
    var date = created.getFullYear() + '-' + created.getMonth() + '-' + created.getDate()
    var time = created.getHours() + ':' + created.getMinutes() + '-' + created.getSeconds()
    var dateTime = date + " " + time
    const { task_name, taskID, depending_task_ids } = req.body
    const { employee_id } = req.user
    try {
        await createNewTaskService(task_name, taskID, employee_id, depending_task_ids, dateTime)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
    return res.status(201).json({ message: "Task created" })


}

const getTaskById = async (req, res) => {
    const { taskID } = req.params
    try {
        const task = await getTaskByIdService(taskID)
        res.status(200).json({ task: task })
        return
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })

    }
}

const completeTask = async (req, res) => {
    const { isCompleted } = req.body
    const { taskID } = req.params

    try {
        await completeTaskService(taskID, isCompleted)
        res.status(200).json({ message: "Updated successfuly" })
        return
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })

    }
}

const deleteTask = async (req, res) => {
    const { taskID } = req.params
    try {
        await deleteTaskByIdService(taskID)
        res.status(200).json({ message: "Deleted successfuly" })
        return
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })

    }
}
module.exports = { getAllTasks, createNewTask, getTaskById, completeTask, deleteTask }