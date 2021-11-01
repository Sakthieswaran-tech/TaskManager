require('dotenv').config()
const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const morgan=require('morgan')
const userRoutes=require('./routes/user')
const port=process.env.PORT || 3000

// app.use(bodyparser({extended:false}))
app.use(bodyparser.json())
app.use(morgan('dev'))

app.use('/users',userRoutes)

app.listen(port,()=>{
    console.log(`Server running : ${port}`);
})


