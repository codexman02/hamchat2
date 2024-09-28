"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {io} from "socket.io-client";
// import { Socket } from "socket.io-client";
export default function SocketIoPage(){
    let [src,setSrc]=useState('')
    const socket=io("http://localhost:5000");
    useEffect(()=>{
socket.on("connection",async (socket)=>{
    console.log("socket connected",socket.id)
});
socket.on('responseEvent',(data:any)=>{
    console.log(data)
})
socket.on("randomEvent",(data)=>{
    console.log(data)
})
// socket.on("123456_files",(data)=>{
//     setSrc(data)
//     console.log(data, "from the server")
// })

return ()=>{
socket.off("123456_files",(data)=>{
    console.log(data)
})
}
    },[socket]);
    socket.on("123456_files",(data)=>{
        setSrc(data)
        console.log(data, "from the server")
    })
    
    async function sendEvent(){
        // socket.emit("myevent","hello server!",(response)=>{
        //     console.log(response)
        // })
        // socket.emit("randomEvent","Hello server");
    }
    const [files,setFiles]=useState<FileList | [] | null>([])
    let formData=new FormData()
//     async function onSubmit(data:FormData){
//         for(let i=0;i<files?.length;i++){
// formData.append(i.toString(),files![i])
// // console.log(formData.get(i.toString()))
//         }
// socket.emit('123456_files',"hello i am from 123456_files event")
// return ()=>{
//     socket.disconnect()
// }
// //         console.log(files)
// // console.log(data.get('file'))
//     }

    return(
        <div>
            <img src={src} alt="" />
            <h1>Socket Page</h1>
            <button className="px-4 py-2 bg-black text-white font-semibold m-2 rounded-md" onClick={()=>sendEvent()}>Send Event</button>
            <div className="form_box max-w-3xl border border-solid border-gray-200 shadow-sm rounded-lg p-10 mx-auto">
                <h1 className="text-center text-gray-800 font-semibold text-3xl my-2">Files Form</h1>
                {/* <form action={onSubmit} className="w-full flex flex-col justify-center items-center">
<div className="my-3">
    <input type="file" name="file" multiple onChange={(e)=>setFiles(e.target.files)}/>
</div>
<Button>Submit File</Button>
                </form> */}
            </div>
        </div>
    )
}