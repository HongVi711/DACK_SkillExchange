/* eslint-disable no-unused-vars */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import io from "socket.io-client";
import userService from "../../services/user.service";
import chatService from "../../services/chat.service";
import authService from "../../services/auth.service";

import iconcamera from '../../assets/ic_camera.svg'; 
import iconImage from '../../assets/ic_image.svg';
import iconAttach from '../../assets/ic_attach.svg';
import iconSend from '../../assets/ic_send.svg';
import iconEmoji from '../../assets/ic_emoji.svg';
import { IoLogoWechat } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { LuScreenShare } from "react-icons/lu";
import { FiCamera } from "react-icons/fi";
import { LuMic } from "react-icons/lu";
import { LuMicOff } from "react-icons/lu";
import { FiCameraOff } from "react-icons/fi";
import "./Chat.css";


const socket = io("http://localhost:5008"); // Connect to Socket.IO server

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
  const navigate = useNavigate();

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const userData = currentUser?.data?.user;

        if (isMounted) {
          setUser(userData);
          socket.emit("userOnline", userData.id || userData._id);
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
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
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
    if (!message.trim()) return;
    try {
      const data = await chatService.sendMessage(chatRoomId, message);
      setMessage("");
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
        audio: true,
      });
      localVideoRef.current.srcObject = stream;

      peerConnectionRef.current = new RTCPeerConnection(servers);
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        const remoteStream = event.streams[0];
        console.log("Received stream:", remoteStream.id, remoteStream.getTracks());

        // Phân biệt camera và màn hình dựa trên số lượng track và loại track
        const audioTracks = remoteStream.getAudioTracks();
        const videoTracks = remoteStream.getVideoTracks();

        if (audioTracks.length > 0 && videoTracks.length > 0 && remoteVideoRef.current) {
          // Luồng camera (có cả audio và video)
          remoteVideoRef.current.srcObject = remoteStream;
        } else if (videoTracks.length > 0 && audioTracks.length === 0 && screenVideoRef.current) {
          // Luồng màn hình (chỉ có video)
          screenVideoRef.current.srcObject = remoteStream;
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", { to: userid, candidate: event.candidate });
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
      audio: true,
    });
    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = new RTCPeerConnection(servers);
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    peerConnectionRef.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      console.log("Received stream:", remoteStream.id, remoteStream.getTracks());

      // Phân biệt camera và màn hình dựa trên số lượng track và loại track
      const audioTracks = remoteStream.getAudioTracks();
      const videoTracks = remoteStream.getVideoTracks();

      if (audioTracks.length > 0 && videoTracks.length > 0 && remoteVideoRef.current) {
        // Luồng camera (có cả audio và video)
        remoteVideoRef.current.srcObject = remoteStream;
      } else if (videoTracks.length > 0 && audioTracks.length === 0 && screenVideoRef.current) {
        // Luồng màn hình (chỉ có video)
        screenVideoRef.current.srcObject = remoteStream;
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("iceCandidate", { to: from, candidate: event.candidate });
      }
    };

    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
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
          video: true,
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
      (s) => s.track && s.track.kind === "video" && s.track.label.toLowerCase().includes("screen")
    );
    if (screenSender) {
      peerConnectionRef.current.removeTrack(screenSender);
    }

    if (screenVideoRef.current && screenVideoRef.current.srcObject) {
      screenVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
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
    localVideoRef.current.srcObject?.getTracks().forEach((track) => track.stop());
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
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
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
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    socket.on("updateOffer", async ({ from, offer }) => {
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState === "stable") {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
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
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
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
      localVideoRef.current.srcObject?.getTracks().forEach((track) => track.stop());
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
          <img className="caller-avatar" src={photos || "default"} alt="Caller Avatar" />
          <p>{`${name || "User"} đang gọi bạn...`}</p>
          <div className="call-buttons">
            <button className="accept-button" onClick={acceptCall}>Chấp nhận</button>
            <button className="decline-button" onClick={declineCall}>Từ chối</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="body-container">
      <div className={`video-call-container ${inCall ? "visible" : "hidden"} ${showChat ? "with-chat" : ""} `}>
        <video ref={localVideoRef} autoPlay muted className="local-video" />
        <video ref={remoteVideoRef} autoPlay className="remotes-video"/>
        <video ref={screenVideoRef} autoPlay className="screen-video" />
        {inCall && (
          <>
            <div className="button-screen">
              <button onClick={toggleCamera} className="button-share">
                {isCameraOn ? <FiCamera size={30} color="white" /> : <FiCameraOff size={30} color="white" />}
              </button>
              <button onClick={toggleMic} className="button-share">
                {isMicOn ? <LuMic size={30} color="white" /> : <LuMicOff size={30} color="white" />}
              </button>
              <button onClick={toggleScreenShare} className="button-share">
                <LuScreenShare size={30} color={isScreenSharing ? "green" : "white"} />
              </button>
              <button onClick={endCall} className="button-end">
                <FaPhone size={30} color="white" />
              </button>
              <button
                className={`chat-bubble-button ${showChat ? "bg-blue-600" : "bg-gray-500"}`}
                onClick={() => setShowChat(!showChat)}
              >
                <IoLogoWechat className="chat-icon" />
              </button>
            </div>
            {showChat && (
              <div className="mini-chat-container">
                <div className="mini-chat-header">
                  <span>Chat</span>
                  <button className="close-chat-button" onClick={() => setShowChat(false)}>✕</button>
                </div>
                <div className="mini-chat-body" ref={miniChatBodyRef}>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mini-message ${
                        message.sender._id === (user?.id || user?._id) ? "message-right" : "message-left"
                      }`}
                    >
                      {message.sender._id !== (user.id || user._id) && (
                        <img className="avatar" src={photos || "default"} alt="Receiver Avatar" />
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
            <img className="avatar" src={photos || "default"} alt="User Avatar" />
            <div className="user-details">
              <div className="user-name">{name || "User"}</div>
              <div className={`user-status ${onlineStatus}`}>
                {onlineStatus === "online" ? "Đang hoạt động" : "Ngoại tuyến"}
              </div>
            </div>
          </div>
          <button className="video-button" onClick={handleVideoCall}>
            <img src={iconcamera} alt="Icon Camera" className="camera-icon" />
            Gọi Video
          </button>
        </div>

        <div className="body-chat" ref={chatBoxRef}>
          {loading ? <p>Loading messages...</p> : null}
          {!inCall &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`message ${
                  message.sender._id === (user.id || user._id) ? "message-right" : "message-left"
                }`}
              >
                {message.sender._id !== (user.id || user._id) && (
                  <img className="avatar" src={photos || "default"} alt="Receiver Avatar" />
                )}
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <small>
                    {new Date(message.createdAt || Date.now()).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            ))}
        </div>

        {!inCall && (
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
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
