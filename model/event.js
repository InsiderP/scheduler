const mongoose=require("mongoose")
const {Schema}=mongoose
const eventSchema=mongoose.Schema({
     name:{
        type:String,
        require:true
     }, 
     startTimeStamp: { 
        type: String, 
        required: true 
    }, 
     endTimeStamp: { 
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