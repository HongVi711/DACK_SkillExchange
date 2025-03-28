import io from "socket.io-client";
const socket = io(`http://${window.location.hostname}:5008`);
export default socket;