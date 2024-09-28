"use client"
import { getServerSession } from "next-auth";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import { getHeaders } from "./crud/functions";
export const SessionBox=({children}:{
    children:React.ReactNode
})=>{
    let session;
   async function getsSession(){
    session=await getSession();
    // console.log(session,"sessio box");
    
    }
    getsSession();
    return(
        <SessionProvider session={session}>{children}</SessionProvider>
    )

}