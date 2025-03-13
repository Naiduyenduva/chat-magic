import { useEffect, useRef, useState } from "react"

const App = () => {
    const [messages, setMessages] = useState(["Let's chat"]);
    const [message, setMessage] = useState("");
    const wssRef = useRef<WebSocket | null>(null);

    useEffect(()=> {
        const wss = new WebSocket("ws://localhost:8080")
            wss.onmessage = (event) => {
                setMessages((prev)=> [...prev,event.data])
            }
            wssRef.current = wss
            wss.onopen = () => {
                wss.send(JSON.stringify({
              type: "join",
              payload: {
                roomId: "red"
              }
            }))
          }
          return () => {
            wss.close();
        };
    },[])
  return (
    <div className="flex flex-row w-screen justify-center items-center mt-2">
        <div className="w-96 border rounded grid">
                <span className="font-bold h-10 text-2xl text-center"><span className="text-blue-600">Blue</span> Chat</span>
            <div className="h-[80vh] overflow-auto">
                {
                    messages.map((message,index) => (
                        <div key={index} className="pl-2 p-1">
                            <h1 className="text-xs bg-white text-black w-fit p-2 rounded">{message}</h1>
                        </div>
                    ))
                }
            </div>
            <div className="flex gap-2 p-2">
                <input onChange={(event)=> setMessage(event.target.value)} className="outline-none w-full border p-2 rounded" placeholder="Type a message..."/>
                <button className="bg-blue-700 p-2 rounded cursor-pointer" onClick={()=> {
                    wssRef.current?.send(JSON.stringify({
                        type: "chat",
                        payload: {
                        message: message
                        }
                    }))
                }}>Send</button>
            </div>
        </div>
    </div>
  )
}

export default App