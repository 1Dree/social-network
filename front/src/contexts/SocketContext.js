import { createContext, useContext, useEffect, useState } from "react";

import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const connSocket = async () => {
    const socketObj = io("http://localhost:3001");

    setSocket(socketObj);

    return socketObj;
  };

  const value = { socket, connSocket };

  useEffect(() => {
    if (!socket) return;

    socket.on("error", data => {
      alert("Socket error.");
      console.log(data);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
