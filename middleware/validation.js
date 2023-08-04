const express=require("express")
const jwt =require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' })
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(token, process.env.SECRET_KEY)
        console.log(err)
        return res.status(401).json({ message: 'Invalid token' })
      }
  
      
      req.decoded = decoded
      next()
    })
  }
  module.exports=verifyToken