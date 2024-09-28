"use client"
import { Navbar } from "@/app/component/Navbar";

export default function Layout({children,contacts,chats}:{
    children:React.ReactNode,
    contacts:React.ReactNode,
    chats:React.ReactNode,
}){

    return(
        <>
      <div>
      <Navbar/>
        {children}
       <div className="flex h-[calc(100vh-70px)] overflow-hidden" >
            <div className="w-1/3 ">
            {contacts}
            </div>
            <div className="messages w-2/3">
                {chats}
            </div>
        </div>
      </div>
        
        </>
    )
 
}