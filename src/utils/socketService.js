import io from "socket.io-client";
import address from "../config/address";

// const SOCKET_URL = "https://backend.ktguru.com"
// const SOCKET_URL = "http://192.168.1.18:4000"
const SOCKET_URL = address.PORT

class WSService{
  initializeSocket = async () =>{
    try {
        this.socket = io(SOCKET_URL , {transports:['websocket']})
        console.log("socket initializing",this.socket
        )
        
    } catch (error) {
     console.log(error)   
    }
  } 
}

const socketServices = new WSService();
export default socketServices