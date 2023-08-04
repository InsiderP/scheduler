const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/user');
const verifyToken=require('../middleware/validation')
const Event = require('../model/event');

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
router.get('/curent',async(req,res)=>{
    res.json(req.user)
})
router.post('/createEvent',verifyToken,async(req,res)=>{
    try{
        const{name,date,startTime,endTime}=req.body
        const{username}=req.decoded
        const user = await User.findOne({username})
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const event = await Event.create({
            name,
            date,
            startTime,
            endTime,
            user:user._id// use the user's id as refernce
        })
        console.log(event)
        //add the event id to the user's event array
        user.event.push(event._id)
        await user.save()
        res.status(201).json({message:"event created successfully",event})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"an error occured",error:error.message})
    }
})
router.get('/event',verifyToken,async(req,res)=>{
   try{
    const{username}=req.decoded
    const user= await User.finOne({username}).populate('event')
    if(!user){
       return res.status(404).json({message:"user not found"}) 
       
    }
    res.json({event:user.event})
   }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
      }
})
router.get('/valid',verifyToken)
module.exports = router