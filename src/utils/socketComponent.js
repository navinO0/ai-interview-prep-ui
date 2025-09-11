import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketInst = (roomId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return; 

    const socket = io("http://172.26.144.1:3008", {
      transports: ["websocket"],
    });

    setSocket(socket);

    return () => socket.disconnect(); 
  }, [roomId]);

  return socket;
};

export default SocketInst;