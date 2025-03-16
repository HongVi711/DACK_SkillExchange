/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import styles from "./UserCard.module.css";
import { useNavigate } from "react-router-dom";
import connectionService from "../../services/connection.service";

function UserCard({ avatar, name, address, skills, userid }) {
  const navigate = useNavigate();
  const [chatRoomId, setChatRoomId] = useState(null);

  const [connectionStatus, setConnectionStatus] = useState(null); // "pending_sent", "pending_received", "connected", "none"
  const [connectionId, setConnectionId] = useState(null);
  const [isReceivedRequest, setIsReceivedRequest] = useState(false);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      try {
        const response = await connectionService.checkConnectionStatus(userid);
        setConnectionStatus(response.data.status);
        setConnectionId(response.data.connectionId || null);
        setIsReceivedRequest(response.data.received);

        setChatRoomId(response.data.chatRoomId || null);
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    };
    fetchConnectionStatus();
  }, [userid]);

  const handleConnect = async () => {
    try {
      await connectionService.sendRequest(userid);
      setConnectionStatus("pending_sent"); // Cập nhật UI ngay lập tức
      setIsReceivedRequest(false);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await connectionService.cancelRequest(userid);
      setConnectionStatus("none"); // Cập nhật UI ngay lập tức
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      await connectionService.acceptRequest(connectionId);
      setConnectionStatus("connected"); 
      setIsReceivedRequest(false);// Cập nhật UI ngay lập tức
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleRejectRequest = async () => {
    try {
       await connectionService.rejectRequest(connectionId);
        setConnectionStatus("none"); // Cập nhật UI ngay lập tức
        setIsReceivedRequest(false);
        setConnectionId(null);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const handleChat = () => {
    if (chatRoomId) {
      navigate(`/chat/${chatRoomId}/${userid}/${name}`); // Chuyển đến phòng chat tương ứng
    } else {
      console.error("Không tìm thấy chatRoomId!");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <img
          src={avatar.data?.image}
          alt={name}
          className={styles.cardAvatar}
        />
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardMajor}>
          Kỹ năng: <span>{skills}</span>
        </p>
        <p className={styles.cardLearn}>
          Địa chỉ: <span>{address}</span>
        </p>

        {connectionStatus === "connected" ? (
          <div className={styles.chat}>
            <button className={styles.connectButton}>Đặt lịch</button>
            <button className={styles.connectButton} onClick={handleChat}>Nhắn tin</button>
          </div>
        ) : connectionStatus === "pending_sent" ? (
          <button className={styles.connectButton} onClick={handleCancelRequest}>
            Hủy yêu cầu
          </button>
        ) : connectionStatus === "pending_received" ? (
          <div className={styles.chat}>
            <button className={styles.connectButton} onClick={handleAcceptRequest}>
              Chấp nhận
            </button>
            <button className={styles.connectButton} onClick={handleRejectRequest}>
              Từ chối
            </button>
          </div>
        ) : (
          <button className={styles.connectButton} onClick={handleConnect}>
            Kết nối
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
