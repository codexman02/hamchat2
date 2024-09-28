import mongoose from "mongoose";

export async function dbConnect(){
    let url=process.env.MONGODB_URI;

    // let connect:Promise<typeof mongoose>|null=null;
    let connect;

    if(!connect){
        
        if(url){
            connect=await mongoose.connect(url);
        }
        
    }
    console.log('connected')
}