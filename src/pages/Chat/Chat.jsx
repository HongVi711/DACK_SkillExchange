/* eslint-disable no-unused-vars */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Modal from "react-modal";
import userService from "../../services/user.service";
import chatService from "../../services/chat.service";
import authService from "../../services/auth.service";
import iconcamera from "../../assets/ic_camera.svg";
import iconImage from "../../assets/ic_image.svg";
import iconAttach from "../../assets/ic_attach.svg";
import iconSend from "../../assets/ic_send.svg";
import { IoLogoWechat } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { LuScreenShare } from "react-icons/lu";
import { FiCamera } from "react-icons/fi";
import { LuMic } from "react-icons/lu";
import { LuMicOff } from "react-icons/lu";
import { FiCameraOff } from "react-icons/fi";
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
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const chatBoxRef = useRef(null);
  const miniChatBodyRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); // Để lưu ảnh đã chọn
  const [selectedFile, setSelectedFile] = useState(null); // Để lưu file đã chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // State để mở/đóng modal
  const [reportReason, setReportReason] = useState(""); // Lý do báo cáo
  const [reportStatus, setReportStatus] = useState(""); // Trạng thái báo cáo
  const [customReason, setCustomReason] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

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
      socket.off("receiveMessage");
      socket.off("onlineStatusUpdate");
      socket.off("userStatusResponse");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      cleanupSocket();
    };
  }, [chatRoomId, userid]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (miniChatBodyRef.current) {
      miniChatBodyRef.current.scrollTop = miniChatBodyRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      localVideoRef.current.srcObject = stream;

      peerConnectionRef.current = new RTCPeerConnection(servers);
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        const remoteStream = event.streams[0];
        console.log(
          "Received stream:",
          remoteStream.id,
          remoteStream.getTracks()
        );

        // Phân biệt camera và màn hình dựa trên số lượng track và loại track
        const audioTracks = remoteStream.getAudioTracks();
        const videoTracks = remoteStream.getVideoTracks();

        if (
          audioTracks.length > 0 &&
          videoTracks.length > 0 &&
          remoteVideoRef.current
        ) {
          // Luồng camera (có cả audio và video)
          remoteVideoRef.current.srcObject = remoteStream;
        } else if (
          videoTracks.length > 0 &&
          audioTracks.length === 0 &&
          screenVideoRef.current
        ) {
          // Luồng màn hình (chỉ có video)
          screenVideoRef.current.srcObject = remoteStream;
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            to: userid,
            candidate: event.candidate
          });
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("callUser", { to: userid, offer });

      setInCall(true);
      setShowChat(false);
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  const acceptCall = async () => {
    const { from, offer } = incomingCall;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = new RTCPeerConnection(servers);
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    peerConnectionRef.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      console.log(
        "Received stream:",
        remoteStream.id,
        remoteStream.getTracks()
      );

      // Phân biệt camera và màn hình dựa trên số lượng track và loại track
      const audioTracks = remoteStream.getAudioTracks();
      const videoTracks = remoteStream.getVideoTracks();

      if (
        audioTracks.length > 0 &&
        videoTracks.length > 0 &&
        remoteVideoRef.current
      ) {
        // Luồng camera (có cả audio và video)
        remoteVideoRef.current.srcObject = remoteStream;
      } else if (
        videoTracks.length > 0 &&
        audioTracks.length === 0 &&
        screenVideoRef.current
      ) {
        // Luồng màn hình (chỉ có video)
        screenVideoRef.current.srcObject = remoteStream;
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: from, candidate: event.candidate });
      }
    };

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    socket.emit("answerCall", { to: from, answer });

    setInCall(true);
    setIncomingCall(null);
  };

  const declineCall = () => {
    socket.emit("endCall", { to: incomingCall.from });
    setIncomingCall(null);
  };

  const toggleMic = () => {
    const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnectionRef.current) return;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        peerConnectionRef.current.addTrack(screenTrack, screenStream);

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }

        if (peerConnectionRef.current.signalingState === "stable") {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit("updateOffer", { to: userid, offer });
        }

        screenTrack.onended = () => stopScreenSharing();
        setIsScreenSharing(true);
      } else {
        stopScreenSharing();
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const stopScreenSharing = async () => {
    if (!peerConnectionRef.current) return;

    const senders = peerConnectionRef.current.getSenders();
    const screenSender = senders.find(
      (s) =>
        s.track &&
        s.track.kind === "video" &&
        s.track.label.toLowerCase().includes("screen")
    );
    if (screenSender) {
      peerConnectionRef.current.removeTrack(screenSender);
    }

    if (screenVideoRef.current && screenVideoRef.current.srcObject) {
      screenVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      screenVideoRef.current.srcObject = null;
    }

    // Gửi thông báo dừng chia sẻ màn hình
    socket.emit("screenShareEnded", { to: userid });

    if (peerConnectionRef.current.signalingState === "stable") {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("updateOffer", { to: userid, offer });
    }

    setIsScreenSharing(false);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    localVideoRef.current.srcObject
      ?.getTracks()
      .forEach((track) => track.stop());
    remoteVideoRef.current.srcObject = null;
    screenVideoRef.current.srcObject = null;
    setInCall(false);
    setShowChat(false);
    setIsScreenSharing(false);
    socket.emit("endCall", { to: userid });
  };

  useEffect(() => {
    socket.on("incomingCall", ({ from, offer }) => {
      setIncomingCall({ from, offer });
    });

    socket.on("callAnswered", async ({ answer }) => {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState === "have-local-offer"
      ) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        } catch (error) {
          console.error("Error setting remote answer:", error);
        }
      }
    });

    socket.on("iceCandidate", async ({ candidate }) => {
      if (
        candidate &&
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState !== "closed"
      ) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    socket.on("updateOffer", async ({ from, offer }) => {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState === "stable"
      ) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("updateAnswer", { to: from, answer });
        } catch (error) {
          console.error("Error handling updateOffer:", error);
        }
      }
    });

    socket.on("updateAnswer", async ({ answer }) => {
      if (
        peerConnectionRef.current &&
        peerConnectionRef.current.signalingState === "have-local-offer"
      ) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        } catch (error) {
          console.error("Error handling updateAnswer:", error);
        }
      }
    });

    socket.on("screenShareEnded", () => {
      // Xóa luồng màn hình ở phía người nhận
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    });

    socket.on("callEnded", () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      localVideoRef.current.srcObject
        ?.getTracks()
        .forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
      screenVideoRef.current.srcObject = null;
      setInCall(false);
      setIsScreenSharing(false);
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAnswered");
      socket.off("iceCandidate");
      socket.off("updateOffer");
      socket.off("updateAnswer");
      socket.off("screenShareEnded");
      socket.off("callEnded");
    };
  }, []);

  const CallNotification = () => {
    if (!incomingCall) return null;

    return (
      <div className="call-notification">
        <div className="call-notification-content">
          <img
            className="caller-avatar"
            src={photos || "default"}
            alt="Caller Avatar"
          />
          <p>{`${name || "User"} đang gọi bạn...`}</p>
          <div className="call-buttons">
            <button className="accept-button" onClick={acceptCall}>
              Chấp nhận
            </button>
            <button className="decline-button" onClick={declineCall}>
              Từ chối
            </button>
          </div>
        </div>
      </div>
    );
  };
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

  // Sửa handler cho report reason
  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReportReason(value);

    if (value === "Khác") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setCustomReason("");
    }
  };

  const handleCustomReasonChange = (e) => {
    setCustomReason(e.target.value);
    setReportReason(e.target.value); // Cập nhật reportReason bằng nội dung người dùng nhập
  };

  // Xử lý submit báo cáo
  const handleReportSubmit = async () => {
    const finalReason = reportReason === "Khác" ? customReason : reportReason;

    if (!finalReason.trim()) {
      Toast.fire({
        icon: "error",
        title: "Vui lòng chọn hoặc nhập lý do báo cáo."
      });
      setReportStatus("Vui lòng chọn hoặc nhập lý do báo cáo.");

      return;
    }

    try {
      const reportData = {
        userId: userid,
        reason: finalReason
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
      setCustomReason("");
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
      <div
        className={`video-call-container ${inCall ? "visible" : "hidden"} ${
          showChat ? "with-chat" : ""
        } `}
      >
        <video ref={localVideoRef} autoPlay muted className="local-video" />
        <video ref={remoteVideoRef} autoPlay className="remotes-video" />
        <video ref={screenVideoRef} autoPlay className="screen-video" />
        {inCall && (
          <>
            <div className="button-screen">
              <button onClick={toggleCamera} className="button-share">
                {isCameraOn ? (
                  <FiCamera size={30} color="white" />
                ) : (
                  <FiCameraOff size={30} color="white" />
                )}
              </button>
              <button onClick={toggleMic} className="button-share">
                {isMicOn ? (
                  <LuMic size={30} color="white" />
                ) : (
                  <LuMicOff size={30} color="white" />
                )}
              </button>
              <button onClick={toggleScreenShare} className="button-share">
                <LuScreenShare
                  size={30}
                  color={isScreenSharing ? "green" : "white"}
                />
              </button>
              <button onClick={endCall} className="button-end">
                <FaPhone size={30} color="white" />
              </button>
              <button
                className={`chat-bubble-button ${
                  showChat ? "bg-blue-600" : "bg-gray-500"
                }`}
                onClick={() => setShowChat(!showChat)}
              >
                <IoLogoWechat className="chat-icon" />
              </button>
            </div>
            {showChat && (
              <div className="mini-chat-container">
                <div className="mini-chat-header">
                  <span>Chat</span>
                  <button
                    className="close-chat-button"
                    onClick={() => setShowChat(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="mini-chat-body" ref={miniChatBodyRef}>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mini-message ${
                        message.sender._id === (user?.id || user?._id)
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
                      <div className="message-text">{message.content}</div>
                    </div>
                  ))}
                </div>
                <div className="mini-chat-footer">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="mini-message-input"
                  />
                  <button className="mini-send-button" onClick={sendMessage}>
                    <img src={iconSend} alt="Send Icon" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <CallNotification />
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
            <button className="video-button" onClick={handleVideoCall}>
              <img src={iconcamera} alt="Icon Camera" className="camera-icon" />
              Gọi Video
            </button>
          </div>
        </div>

        <div className="body-chat" ref={chatBoxRef}>
          {loading ? <p>Loading messages...</p> : null}
          {!inCall &&
            messages.map((message) => (
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
                        <FaFilePdf
                          size={64}
                          className="fill-white hover:fill-red-700"
                        />
                      </a>
                    )}
                  </div>

                  <small>
                    {new Date(
                      message.createdAt || Date.now()
                    ).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </small>
                </div>
              </div>
            ))}
        </div>
        {!inCall && (
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
        )}
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
            onChange={handleReasonChange}
            className="w-full p-2 border rounded-lg mb-3"
          >
            <option value="">Chọn lý do</option>
            <option value="Hành vi không phù hợp">Hành vi không phù hợp</option>
            <option value="Spam">Spam</option>
            <option value="Quấy rối">Quấy rối</option>
            <option value="Nội dung không phù hợp">
              Nội dung không phù hợp
            </option>
            <option value="Khác">Khác</option>
          </select>

          {showCustomInput && (
            <input
              type="text"
              value={customReason}
              onChange={handleCustomReasonChange}
              placeholder="Nhập lý do khác"
              className="w-full p-2 border rounded-lg mb-3"
            />
          )}
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
