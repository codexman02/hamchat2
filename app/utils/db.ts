import mongoose from "mongoose";

export async function dbConnect(){
    let url;
    if(process.env.NODE_ENV=='production'){
        url=process.env.MONGODB_URI
    }else if(process.env.NODE_ENV=='development'){
        url='mongodb://localhost:27017/hamchat'
    }

    // let connect:Promise<typeof mongoose>|null=null;
    let connect;

    if(!connect){
        
        if(url){
            connect=await mongoose.connect(url);
        }
        
    }
    console.log('connected')
}