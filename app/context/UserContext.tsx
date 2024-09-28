"use client"
import { createContext, useState } from "react";
export const UserContext=createContext({});
export default function UserContextProvider({children}:{
    children:React.ReactNode
}){
let [user,setUser]=useState<{}| {username?:string,email?:string}>({});
return (
    <>
    <UserContext.Provider value={{user,setUser}}>
        {children}
    </UserContext.Provider>
    </>
)
}