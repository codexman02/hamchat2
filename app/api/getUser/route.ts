
import { User } from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET(request:Request){
   
    let {searchParams}=new URL(request.url)
    let a=searchParams.get('username')
    let regex;
    if(a!.length>0){
         regex=new RegExp(`${a}`)
    }else{
        return NextResponse.json({
            status:400,
            message:"No User found"
        })
    }
    // console.log(regex,"regex")
    let user=await User.User.find({username:regex},{username:1,email:1}).limit(10);
    // console.log(user,"user")
    if(user.length>0){
        return NextResponse.json(user)
    }else{
        return NextResponse.json({
            status:400,
            message:"No User found"
        })
    }
// return NextResponse.json(a)
}