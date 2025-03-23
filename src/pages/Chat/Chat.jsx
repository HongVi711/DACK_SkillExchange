/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import userService from "../../services/user.service";
import chatService from "../../services/chat.service";
import authService from "../../services/auth.service";

import iconcamera from "../../assets/ic_camera.svg";
import iconImage from "../../assets/ic_image.svg";
import iconAttach from "../../assets/ic_attach.svg";
import iconSend from "../../assets/ic_send.svg";
import "./Chat.css";

import socket, {
  joinChatRoom,
  setUserOnline,
  checkUserStatus,
  cleanupSocket
} from "../../configs/socket/socket"; // Import from socket.config
import Loading from "../../components/Loading";
import { FaFilePdf } from "react-icons/fa";
import { MdOutlineReport } from "react-icons/md";
import reportService from "../../services/report.service";
import Toast from "../../utils/Toast";

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
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); // Để lưu ảnh đã chọn
  const [selectedFile, setSelectedFile] = useState(null); // Để lưu file đã chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // State để mở/đóng modal
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [reportStatus, setReportStatus] = useState(""); // Trạng thái báo cáo

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const userData = currentUser?.data?.user;

        if (isMounted) {
          setUser(userData);
          setUserOnline(userData.id || userData._id);
          joinChatRoom(chatRoomId);
          checkUserStatus(userid);

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
              const exists = prevMessages.some(
                (msg) => msg._id === newMessage._id
              );
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
      cleanupSocket();
    };
  }, [chatRoomId, userid]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage && !selectedFile) return; // Không gửi nếu không có gì

    try {
      const formData = new FormData();
      formData.append("chatRoomId", chatRoomId); // Thêm chatRoomId vào FormData
      if (message.trim()) {
        formData.append("content", message);
      }
      if (selectedImage) {
        formData.append("image", selectedImage); // Gửi ảnh nếu có
      }
      if (selectedFile) {
        formData.append("file", selectedFile); // Gửi file nếu có
      }
      const data = await chatService.sendMessage(formData);
      setMessage("");
      setSelectedImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const triggerImageUpload = () => {
    imageInputRef.current.click();
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  // Mở modal khi nhấn nút Report
  const openReportModal = () => {
    setIsModalOpen(true);
    setReportReason(""); // Reset lý do khi mở modal
    setReportStatus(""); // Reset trạng thái
  };

  // Đóng modal
  const closeReportModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý submit báo cáo
  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      setReportStatus("Vui lòng chọn lý do báo cáo.");
      return;
    }

    try {
      const reportData = {
        userId: userid,
        reason: reportReason
      };
      await reportService.createReport(reportData); // Gọi API báo cáo
      Toast.fire({
        icon: "success",
        title: "Báo cáo đã được gửi thành công!"
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setReportStatus("");
      }, 1000); // Đóng modal sau 2 giây
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Không thể gửi báo cáo. Vui lòng thử lại sau."
      });
    }
  };

  if (!user)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1
        }}
      >
        <Loading />
      </div>
    );

  return (
    <div className="body-container">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="chat-container">
        <div className="header-chat">
          <div className="user-info">
            <img
              className="avatar"
              src={photos || "default"}
              alt="User Avatar"
            />
            <div className="user-details">
              <div className="user-name">{name || "User"}</div>
              <div className={`user-status ${onlineStatus}`}>
                {onlineStatus === "online" ? "Đang hoạt động" : "Ngoại tuyến"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <button
              className="video-button mr-2"
              style={{ backgroundColor: "yellow" }}
              onClick={openReportModal} // Mở modal khi nhấn Report
            >
              <MdOutlineReport size={24} color="black" />
            </button>
            <button className="video-button">
              <img src={iconcamera} alt="Icon Camera" className="camera-icon" />
              Gọi Video
            </button>
          </div>
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
                <div className="message-text">
                  {message.content}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Hình ảnh"
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                  {message.file && (
                    <a
                      className="message-file"
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="file.pdf"
                    >
                      <FaFilePdf size={64} />
                    </a>
                  )}
                </div>

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
            <button className="image-button" onClick={triggerImageUpload}>
              <img src={iconImage} alt="Image Icon" />
            </button>
            <button className="file-button" onClick={triggerFileUpload}>
              <img src={iconAttach} alt="Attach Icon" />
            </button>

            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
              ref={imageInputRef}
              accept="image/*"
            />
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              ref={fileInputRef}
            />

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
            </div>

            <button className="send-button" onClick={sendMessage}>
              <img src={iconSend} alt="Send Icon" />
            </button>
          </div>
          {/* Hiển thị ảnh và file đã chọn  */}
          {selectedImage && (
            <div>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Ảnh đã chọn"
                style={{ maxWidth: "100px", marginTop: "5px" }}
              />
            </div>
          )}
          {selectedFile && (
            <div>
              <p>Đã chọn file: {selectedFile.name}</p>
            </div>
          )}
        </div>
      </div>
      {/* Modal báo cáo */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeReportModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-2">Báo cáo người dùng</h2>
          <p className="text-sm text-gray-600 mb-2">
            Vui lòng chọn lý do báo cáo:
          </p>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3"
          >
            <option value="">Chọn lý do</option>
            <option value="Hành vi không phù hợp">Hành vi không phù hợp</option>
            <option value="Spam">Spam</option>
            <option value="Quấy rối">Quấy rối</option>
            <option value="Nội dung không phù hợp">
              Nội dung không phù hợp
            </option>
          </select>
          {reportStatus && (
            <p className="text-sm text-red-500 mb-3">{reportStatus}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeReportModal}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Hủy
            </button>
            <button
              onClick={handleReportSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Gửi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatRoom;
