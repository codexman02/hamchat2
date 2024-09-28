"use client";

import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function MessagesPage(){
    let [isUser,setIsUser]=useState(false);
    let params=useParams();
    let id=params.id as string
    async function getData(){
        let session=await getSession();
        if(session?.user._id==id){
            setIsUser(true);
        }
    }
    getData()
     return(
<div className="main w-full h-full">
   {isUser &&  <div className="content w-full h-full p-10 flex justify-center items-center">
<h2 className="text-3xl font-semibold px-10 text-gray-800 text-center">Select any contact to start your conversation.</h2>
    </div>}
</div>

    )
}
