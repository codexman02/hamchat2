import mongoose from "mongoose";


const RequestsSchema=new mongoose.Schema({
    users:[String],
    requestTo:String,
    requestedBy:String,
    accepted:Boolean,
    rejected:Boolean,
    rejectedBy:String,
})


export const Requests=mongoose.models.Requests || mongoose.model("Requests",RequestsSchema)