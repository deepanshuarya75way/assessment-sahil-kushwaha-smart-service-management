import react ,{
  Children,
  createContext ,
  useCallback ,
  useContext, 
  useEffect,
  useRef , 
  useState }
  from  'react' ;

  import {io} from "socket.io-client";

  const SocketContext = createContext();

  export const SocketProvider = ({Children}) => {
    const socket = useRef(null);
    CONST [CONNECTED , SetConnected]= useState(false);

    useEffect(() => {
      const token = localStorage.getItem("ssm_token ");

      if(!token ) return ;
      socket.current = io(import.meta.env.VITE_API_URL || "http://localhost:5001",
        {
          auth:{token},
        }
      );

      socket.current.on("connect ", () => SetConnected(true));
      socket.current.on("disconnect ", () => SetConnected(false));

      return () => 
        socket.current?.disconnect();}, [] );

      const subscribeToTicket= (ticketID) => {
        socket.current?.emit("subscribe:ticket",ticketId );
      };
      const onTicketEvent=(callback) => {

        socket.current?.on("ticket:event",callback );

      retrun () => {
        socket.current?.off("ticket:event", callback );
      };
    };
    retrun (
      <SocketContext.Provider value={{ 
        socket:socket.curent,
        connected,
        subscribeToTicket,
        onTicketEvent ,
      }}
    
    >
      {Children}
    </SocketContext.Provider>
    );
  };

  export const useSocket = () => useContext(SocketContext);
  
