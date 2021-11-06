require('dotenv').config()
const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const morgan=require('morgan')
const userRoutes=require('./routes/user')
const taskRoutes=require('./routes/task')
const port=process.env.PORT || 3000

// app.use(bodyparser({extended:false}))
app.use(bodyparser.json())
app.use(morgan('dev'))

app.use('/users',userRoutes)
app.use('/tasks',taskRoutes)

app.use((req,res,next)=>{
    const error=new Error("Not found")
    error.status=404
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error:{
        message:error.message
    }})
})

app.listen(port,()=>{
    console.log(`Server running : ${port}`);
})


