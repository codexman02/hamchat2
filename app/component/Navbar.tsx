"use client"
import { Session } from "next-auth";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar({background,height}:{background?:string,height?:string}){
  let [status,setStatus]=useState(false);
let [user,setUser]=useState<string | undefined>("");
let [userData,setUserData]=useState<{username?:string,email?:string,isVerified?:boolean,_id?:string} | null>(null);
let [checkSession,setCheckSession]=useState(false);
  let session=useSession();
  async function gettingSession(){
    // console.log(session)
    if(session.status=="authenticated"){
setStatus(true);
//  user=await getSession();
 setUser(session.data.user._id);
 setUserData(session.data.user);

// console.log(session,"user from ")
// setUser(b)
    }else if(session.status=="loading"){
setTimeout(()=>{
  setCheckSession(!checkSession);
},800)
    }
  }
// let [loggedIn,setLoggedIn]=useState(false);
// export function isLogged(status){
// console.log(status)
useEffect(()=>{
  gettingSession();
  // console.log(status,"status of user")
},[checkSession])

  return(
    <>
    <nav className={height?`${height} ${background}`:`h-[70px] ${background}`} >
        <ul className="flex gap-4 py-0 px-5 w-[60%] h-full" >
           {!status &&  <>
            <Link href={`/api/signup`} className="cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-black after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out ">Sigup</Link>
            <li className="cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-white after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out  " onClick={()=>{signIn()}}>Login</li>
           </>
            }
            {user &&  <>
            <li className="cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-white after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out"><Link href={`/profile/${user}`}>Profile</Link></li>
           
            <li className="cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-white after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out  ">Chat</li>
            <li className="cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-white after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out " onClick={()=>signOut()}>Logout</li>
           
            {(userData?.isVerified && userData.username)?(<>
              {user && <Link href={`/messages/${user}`} className="flex  justify-center items-center"><li className="cursor-pointer text-gray-700 hover:text-black flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-gray-900 after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out ">Messages</li></Link>}
            <li className="flex h-full items-center">
            <Link href={`/groups/${user}`} className="text-gray-700 hover:text-black cursor-pointer flex justify-center items-center relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:bg-gray-900 after:z-20 after:inline-block after:h-0.5 after:mt-1 after:hover:w-full transition-all after:hiver:duration-200 after:transition-all after:ease-in-out after:hover:ease-in-out">Groups</Link>
            </li>
            </>):(<></>)}
            </>}
        </ul>
        {/* <hr className="my-0"/> */}
    </nav>
    
    </>
  )
}