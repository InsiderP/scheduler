const mongoose=require("mongoose")
const {Schema}=mongoose
const eventSchema=mongoose.Schema({
     name:{
        type:String,
        require:true
     },
     date: { 
        type: String,
         required: true 
        }, 
     startTime: { 
        type: String, 
        required: true 
    }, 
     endTime: { 
        type: String, 
        required: true 
    },
     user:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
     }
 })
 module.exports=mongoose.model("Event",eventSchema)