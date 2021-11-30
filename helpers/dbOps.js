const { connection } = require('../helpers/db')

const createNewTaskService = async (taskName, taskID, employeeId, dependingTaskIds, createdDateTime,assigned_to,estimated_start,estimated_complete) => {
    let db = await connection()
    const sql = "INSERT INTO tasks(task_name,taskID, created_by,created_at,start_time,completed_at,isCompleted,assigned_to,estimated_start,estimated_complete) VALUE(?,?,?,?,?,?,?,?,?,?)"
    const [result, _] = await db.query(sql, [taskName, taskID, employeeId, createdDateTime, null, null, false,assigned_to,estimated_start,estimated_complete])
    const insertedId = result.insertId
    if (dependingTaskIds && dependingTaskIds.length > 0) {
        await insertDependentTasks(insertedId, dependingTaskIds)
    }
}

const insertDependentTasks = async (parentTaskId, dependentTaskIds) => {
    let db = await connection()

    dependentTaskIds.map(async (v) => {
        const sql = "INSERT INTO dependent_tasks(parent_task_id, dependent_task_id) VALUE (?, ?)"
        await db.query(sql, [parentTaskId, v])
    })
}

const completeTaskService = async (taskId, isCompleted,comments) => {
    let db =await connection()
    let created = new Date()
    let date = created.getFullYear() + '-' + created.getMonth() + '-' + created.getDate()
    let time = created.getHours() + ':' + created.getMinutes() + '-' + created.getSeconds()
    let dateTime = date + " " + time
    const query = "UPDATE tasks SET completed_at=?, isCompleted=? ,comments=? WHERE id=?"
    const [result, _] = await db.query(
        query, [dateTime, isCompleted, comments,taskId])
}

const startTaskService=async(taskID,start_time)=>{
        let db =await connection()
        const sql="UPDATE tasks SET start_time=? WHERE id=?"
        const [result,_]=await db.query(sql,[start_time,taskID])
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
        console.log(task);
        return task
    }
}

const getAllTasksService = async () => {
    const sql = "SELECT * FROM tasks ORDER BY id DESC"
    let db = await connection()

    const [rows, fields] = await db.query(sql)
    return rows
}

const getDependentTasks = async (taskId) => {
    const sql = "SELECT t.* FROM tasks t JOIN dependent_tasks dt ON t.id=dt.dependent_task_id  WHERE dt.parent_task_id=?"
    let db = await connection()
    const [rows, fields] = await db.query(sql, [taskId])
    return rows
}

const deleteTaskByIdService = async (taskId) => {
    let db =await connection()

    taskId = parseInt(taskId, 10)
    const query = "DELETE FROM tasks WHERE id=?"
    const [rows,_]=await db.query(query, [taskId])
}

module.exports={
    createNewTaskService,
    deleteTaskByIdService,
    completeTaskService,
    getTaskByIdService,
    getAllTasksService,
    getDependentTasks,
    startTaskService
}
