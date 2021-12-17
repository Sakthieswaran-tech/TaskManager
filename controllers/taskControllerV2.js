require('dotenv').config()
const { connection } = require('../helpers/db')
const { createNewTaskService, deleteTaskByIdService, completeTaskService, getAllTasksService, getTaskByIdService, startTaskService } = require('../helpers/dbOps')

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

const startTask=async(req,res)=>{
    const {taskID}=req.params
    const {start_time}=req.body
    try{
        await startTaskService(Number.parseInt(taskID),start_time)
        return res.status(200).json({message:"Task started"})
    }
    catch(error){
        return res.status(500).json({error:error})
    }
}

const createNewTask = async (req, res) => {
    var created = new Date()
    var month=Number.parseInt(created.getMonth())+1
    var date = created.getFullYear() + '-' + month + '-' + created.getDate()
    var time = created.getHours() + ':' + created.getMinutes() + '-' + created.getSeconds()
    var dateTime = date + " " + time
    const { task_name, taskID, depending_task_ids,assigned_to,estimated_start,estimated_complete,estimated_start_time,estimated_complete_time } = req.body
    const { employee_id } = req.user
    try {
        await createNewTaskService(task_name, taskID, employee_id, depending_task_ids, dateTime,assigned_to,estimated_start,estimated_complete,estimated_start_time,estimated_complete_time)
        console.log(req.body);
        return res.status(201).json({ message: "Task created" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

const getTaskByRole=async(req,res)=>{
    const {role,completed}=req.query
    let db=await connection()
    try{
        const sql="SELECT * FROM tasks WHERE assigned_to=? AND isCompleted=? ORDER BY id DESC"
        const [rows,fields]=await db.query(sql,[role,Number.parseInt(completed)])
        if(rows.length>0){
            return res.status(200).json({tasks:rows})
        }
        else{
            return res.status(404).json({message:"Task not found"})
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error:error})
    }
}

const getTaskById = async (req, res) => {
    const { taskID } = req.params
    try {
        const task = await getTaskByIdService(taskID)
        return res.status(200).json({ task: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

const getTasksByGroup=async(req,res)=>{
    
    let db=await connection();
    const sql="SELECT COUNT(id) AS id_count,DATE(completed_at) AS completed_count FROM tasks WHERE completed_at IS NOT NULL GROUP BY DATE(completed_at) ORDER BY completed_at";
    const [row,fields]=await db.query(sql);
    return res.status(200).json(row);
}

const getCurrentTask=async(req,res)=>{
    const {estimated_start,role}=req.query;
    let db=await connection();
    const sql="SELECT * FROM tasks WHERE assigned_to=? AND estimated_start=? ORDER BY estimated_start_time ASC";
    const [row,fields]=await db.query(sql,[role,estimated_start]);
    console.log(row);
    return res.status(200).json({tasks:row})
}
const completeTask = async (req, res) => {
    const { isCompleted ,comments} = req.body
    const { taskID } = req.params
    try {
        await completeTaskService(Number.parseInt(taskID), isCompleted,comments)
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

module.exports = { 
    getAllTasks,
    createNewTask,
    getTaskById,
    getTaskByRole,
    completeTask,
    startTask,
    deleteTask,
    getTasksByGroup,
    getCurrentTask
}