// socket.config.js
import io from "socket.io-client";
import Toast from "../../utils/Toast";

// Initialize socket connection
const socket = io(
  // `https://${window.location.hostname}:${import.meta.env.VITE_PORT}`,
  `${import.meta.env.VITE_HOST}`,
  {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
);

// Connection event handlers
socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from Socket.IO server:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("receive-notify-book-appointment", (data) => {
  Toast.fire({
    icon: "info",
    title: data.message || "Bạn có 1 cuộc hẹn mới!"
  });
});

// Function to join a chat room
export const joinChatRoom = (chatRoomId) => {
  socket.emit("joinRoom", chatRoomId);
};

// Function to set user online status
export const setUserOnline = (userId) => {
  socket.emit("userOnline", userId);
};

// Function to check user status
export const checkUserStatus = (userId) => {
  socket.emit("checkUserStatus", userId);
};

// Function to cleanup socket listeners
export const cleanupSocket = () => {
  socket.off("receiveMessage");
  socket.off("onlineStatusUpdate");
  socket.off("userStatusResponse");
  socket.off("receive-notify-book-appointment");
};

export default socket;
