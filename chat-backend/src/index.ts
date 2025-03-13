import websocket,{WebSocket} from "ws";

const wss = new websocket.Server({port:8080});

interface User {
    socket: WebSocket;
    room: string
}

let allSockets: User[] = [];
let count = 0;

wss.on("connection",(socket)=> {
    count++
    socket.on("message",(message:string)=> {
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type === "chat") {
           const currentUserRoom = allSockets.find((x)=>x.socket==socket)?.room
           for(let i=0;i<allSockets.length;i++) {
               if(allSockets[i].room == currentUserRoom) {
                allSockets[i].socket.send(parsedMessage.payload.message)
               }
            }
        }
    })
    socket.on("close",()=> {
        console.log("chat closed/disconnected",count)
    })
})