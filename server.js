const express = require("express")
const mongoose =require("mongoose")
const dotenv=require("dotenv")
dotenv.config()
const auth=require('./route/auth')

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  })
.then(()=>console.log("connection successful"))
.catch(err=>console.error("could not connect mongodb",err))
const app=express()
app.use(express.json())

const port=process.env.PORT||3000
app.use('/auth',auth)


app.listen(port,()=>{
    console.log(`server is running ${port}`)
})