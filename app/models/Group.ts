import mongoose from "mongoose";
const fileSchema=new mongoose.Schema({
    name:String,
    src:String,
    type:String,
    image_id:String

});
const Message=new mongoose.Schema({
contentType:{
type:String 
},
messageId:String,
content:{
    type:String
},
image:{
    type:fileSchema
},
sentBy:{
    type:String,
},
sentAt:{
    type:String
},
seenBy:[String],
profile:String
})
let GroupSchema=new mongoose.Schema({
    groupName:String,
messages:[Message],
members:{
    type:[{
        user_id:String,
        hasAccepted:Boolean,
        isAdmin:Boolean,
        username:String,
        email:String,
        profile:String
    }]
},
group_id:String,
admin:[String]
})

export const Group=mongoose.models.Group || mongoose.model("Group",GroupSchema)

