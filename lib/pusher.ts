// import PusherServer from 'pusher';
import PusherClient from 'pusher-js';
// import Pusher from 'pusher-js'
// export const pusherServer=new PusherServer({
//     appId:process.env.Pusher_App_Id,
//     key:process.env.Pusher_Key,
//     secret:process.env.Pusher_Secret,
//     cluster:process.env.Pusher_Cluster


// })

export const pusherClient=new PusherClient("b7c5d0cc0b636650922c",{
    cluster:"ap2"
}
    

)
import Pusher from "pusher";
// const Pusher=require("pusher")
export const pusher=new Pusher({
    appId:"1830501",
    key:"b7c5d0cc0b636650922c",
    secret:"476bfd1e696f1b501b1d",
        cluster:"ap2" ,
       
})


