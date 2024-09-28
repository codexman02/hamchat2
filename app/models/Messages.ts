import mongoose from "mongoose";
export const fileSchema=new mongoose.Schema({
    name:String,
    src:String,
    type:String,
    image_id:String

});
export const Message=new mongoose.Schema({
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
seenBy:[String]
})

const newMessageSchema=new mongoose.Schema({
    isLocked:Boolean,
    lockedBy:String || null,
    users:{
        type:[String]
    },
    messages:{
        type:[Message]
    },
    blockList:[],
    groups:[]
    

});

export const Messages=mongoose.models.Messages || mongoose.model("Messages",newMessageSchema)