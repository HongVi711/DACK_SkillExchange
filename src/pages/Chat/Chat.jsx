/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import userService from "../../services/user.service";
import chatService from "../../services/chat.service";
import authService from "../../services/auth.service";

import iconcamera from '../../assets/ic_camera.svg'; 
import iconImage from '../../assets/ic_image.svg';
import iconAttach from '../../assets/ic_attach.svg';
import iconSend from '../../assets/ic_send.svg';
import iconEmoji from '../../assets/ic_emoji.svg';
import "./Chat.css";


const socket = io("http://localhost:5008"); // Connect to Socket.IO server

const ChatRoom = () => {
  const { chatRoomId, userid, name } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [photos, setPhotos] = useState(null); // Avatar của người nhận
  const [loading, setLoading] = useState(true);
  const chatBoxRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const userData = currentUser?.data?.user;

        if (isMounted) {
          setUser(userData);
          socket.emit("userOnline", userData.id || userData._id); // Dùng id hoặc _id tùy cấu trúc
          socket.emit("joinRoom", chatRoomId);
          socket.emit("checkUserStatus", userid);

          socket.on("userStatusResponse", ({ userId, status }) => {
            if (userId === userid) setOnlineStatus(status);
          });

          const data = await chatService.getMessages(chatRoomId);
          setMessages((prev) => {
            const messageIds = new Set(prev.map((msg) => msg._id));
            const newMessages = data.data.messages.filter(
              (msg) => !messageIds.has(msg._id)
            );
            return [...newMessages.reverse(), ...prev];
          });

          socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => {
              const exists = prevMessages.some((msg) => msg._id === newMessage._id);
              if (!exists) return [...prevMessages, newMessage];
              return prevMessages;
            });
          });

          socket.on("onlineStatusUpdate", ({ userId, status }) => {
            if (userId === userid) setOnlineStatus(status);
          });

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setErrorMessage("Không thể lấy tin nhắn. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
      socket.off("receiveMessage");
      socket.off("onlineStatusUpdate");
      socket.off("userStatusResponse");
    };
  }, [chatRoomId, userid]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const data = await chatService.sendMessage(chatRoomId, message); // Lấy dữ liệu trực tiếp
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Không thể gửi tin nhắn. Vui lòng thử lại sau."); // Hiển thị thông báo lỗi
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const avatar = await userService.getAvatarUser(userid);
        setPhotos(avatar.data?.image);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhotos();
  }, [userid]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="body-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="chat-container">
        <div className="header-chat">
          <div className="user-info">
            <img className="avatar" src={photos || "default"} alt="User Avatar" />
            <div className="user-details">
              <div className="user-name">{name || "User"}</div>
              <div className={`user-status ${onlineStatus}`}>
                {onlineStatus === "online" ? "Đang hoạt động" : "Ngoại tuyến"}
              </div>
            </div>
          </div>
          <button className="video-button">
            <img src={iconcamera} alt="Icon Camera" className="camera-icon" />
            Gọi Video
          </button>
        </div>

        <div className="body-chat" ref={chatBoxRef}>
          {loading ? <p>Loading messages...</p> : null}
          {messages.map((message) => (
            <div
              key={message._id}
              className={`message ${
                message.sender._id === (user.id || user._id)
                  ? "message-right"
                  : "message-left"
              }`}
            >
              {message.sender._id !== (user.id || user._id) && (
                <img
                  className="avatar"
                  src={photos || "default"}
                  alt="Receiver Avatar"
                />
              )}
              <div className="message-content">
                {/* <strong>{message.sender?.name || "Unknown"}</strong> */}
                <div className="message-text">{message.content}</div>
                <small>
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString(
                    "vi-VN",
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </small>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-chat">
          <div className="input-area">
            <button className="image-button">
              <img src={iconImage} alt="Image Icon" />
            </button>
            <button className="file-button">
              <img src={iconAttach} alt="Attach Icon" />
            </button>
            <div className="message-input-wrapper">
              <input
                type="text"
                className="message-input"
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                onKeyDown={handleKeyDown}
              />
              <button className="emoji-button">
                <img src={iconEmoji} alt="Emoji Icon" />
              </button>
            </div>
            <button className="send-button" onClick={sendMessage}>
              <img src={iconSend} alt="Send Icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;