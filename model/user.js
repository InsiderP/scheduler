const mongoose =require('mongoose')
const { Schema } = mongoose
const userSchema = mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique: true 
    },
    password:{
        type:String,
        required:true
    },
    event:[
        {type:Schema.Types.ObjectId,
        ref:'Event'},
    ]
})
module.exports=mongoose.model("User",userSchema)