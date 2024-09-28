import mongoose from "mongoose";

export async function dbConnect(){
    let url;
    console.log(process.env.MONGODB_URI)
    if(process.env.NODE_ENV=='production'){
        url=process.env.MONGODB_URI?.toString();
    }else if(process.env.NODE_ENV=='development'){
        url='mongodb://localhost:27017/hamchat'
        // url=process.env.MONGODB_URI?.toString()
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