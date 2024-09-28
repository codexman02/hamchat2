"use client";
import { getChat } from "@/app/utils/crud/functions";
import { useParams } from "next/navigation";
import { useEffect } from "react";
export default function Chats(){
    // let params=useParams()

    // console.log(params)
    // async function chats(){
    //    let chat=await getChat([params.id as string,params.chatId as string])
    //    let response=JSON.parse(chat.data)
    //    console.log(response)
    // }
    // useEffect(()=>{
    //     chats()
    // })
    return(
        <>
        CHats</>
    )
}