import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketCtx = createContext(null);
export const useSocket = () => useContext(SocketCtx);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;
    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(s);
    return () => s.disconnect();
  }, [user]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}
