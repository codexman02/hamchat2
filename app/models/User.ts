import mongoose from "mongoose";
const group=new mongoose.Schema({
    group_id:String,
    groupName:String,
    members:{
        type:[{user_id:String,hasAccepted:Boolean}]
    },
    lastMessage:{
        content:String,
        sentAt:Date
    }
})
const Message=new mongoose.Schema({
    content:String,
    sentBy:{
        type:String,
    },
    sentAt:{
        type:Date
    }
    })
const UserSchema=new mongoose.Schema({
name:{
    type:String || null,   
},
username:{
type:String || null,
unique:false,
min:5,
max:15
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    min:4,
    required:false
},
contacts:{
    type:[String]
},
contactList:{
    type:[{contact_id:String,lastMessage:{content:String,sentAt:Date},numberOfNewMessages:Number}]
},
isVerified:{
    type:Boolean,
    default:false,

},
VerificationCode:{
    type:Number || null,
    
},
VerificationExpiry:{
    type:Date || null,

},
groups:[group],
profile:String
})

export const User={
    User:mongoose.models.User || mongoose.model('User',UserSchema)
}
