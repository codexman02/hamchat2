const { createServer}=require('http');
const {Server}=require("socket.io");

const httpServer=createServer();
const io=new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});


io.on('connection',async (socket)=>{

socket.on('meri_file',(data)=>{
    io.emit("meri_file2",data)
    // socket.emit("meri_file2",data)
    console.log(data,"meri_file")
});
socket.onAny((eventName,...data)=>{
    io.emit(eventName,data)
    console.log(data,eventName)
})
console.log("user connection-id",socket.id)
socket.on("disconnect",(socket)=>{
    console.log("user disconnected with id-" ,socket.id)
})
})





httpServer.listen(5000,()=>{
    console.log("server is listening at port 5000")
})

