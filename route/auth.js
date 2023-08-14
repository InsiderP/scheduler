const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/user');
const verifyToken=require('../middleware/validation')
const Event = require('../model/event');
const cron = require('node-cron')
router.post('/register',async (req,res)=>{
    try{
        const{id,firstname,lastname,username,password}=req.body
        const existingUser=await User.findOne({username})
        if(existingUser){
            return res.status(409).json({message:"usename already exist"})
        }
        const hashPassword= await bcrypt.hash(password,10)
        console.log("hashed password",hashPassword)
        const user= await User.create({
            id,
            firstname,
            lastname,
            username,
            password:hashPassword,
        })
        res.json({message:"register sucessfully"})
    }catch(error){
        res.status(500).json({message:'An error occured',error:error.message})
    }
})
router.post('/login',async(req,res)=>{
    try{
        const{username,password}=req.body
    const user=await User.findOne({username})
    if(user && (await bcrypt.compare(password,user.password))){
        const accesstoken=jwt.sign(
            {
                
             username:user.username,
                
            },
            process.env.SECRET_KEY,
            { expiresIn:"15m"}
        )
        res.json({accesstoken})
    }
    }catch(error) {
            res.status(500).json({ message: 'An error occurred', error: error.message });
          
    }
})

router.post('/createEvent',verifyToken,async(req,res)=>{
    try{
        const{name,startTimeStamp,endTimeStamp}=req.body
        const{username}=req.decoded
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const event = new Event({
            name,
            startTimeStamp,
            endTimeStamp,
            user:user// use the user's id as refernce
        })
        //add the event id to the user's event array
        user.event.push(event._id)
        await user.save()
        await event.save()
        
        cron.schedule(
            '*/10 * * * * *',
            () => {
                
                console.log(`Scheduled task for event '${event.name}' is running...`)
                
            },
            {
                scheduled: true,
            }
        )
        res.status(201).json({message:"event created successfully",event})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"an error occured",error:error.message})
    }
})
// corn.schedule('*/10 * * * * *',()=>{
//     console.log('hello world')
// })

router.get('/event',verifyToken,async(req,res)=>{
   try{
    const{username}=req.decoded
    const user= await User.findOne({username}).populate('event')
    if(!user){
       return res.status(404).json({message:"user not found"}) 
       
    }
    res.json({event:user.event})
   }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
})
router.get('/event/:id',verifyToken,async(req,res)=>{
    try{
        const id=req.params.id 
        const event = await Event.findOne({_id:id})
        res.json(event)

    }catch(error){
        res.status(500).json({message:'an error occured',error:error.message})
    }
})
router.put("/update/:id",verifyToken,async(req,res)=>{
    try{
        const id=req.params.id
        const event =await Event.findOne({_id:id})
        if(!event){
            res.json({message:"not found"})
        }
        const updateContact= await Event.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )
      res.json({ message:"updated"})

    }catch(error){
        res.status(500).json({message:'an error occured',error:error.message})
    }
})
module.exports = router