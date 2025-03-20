/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import styles from "./UserCard.module.css";
import userService from "../../services/user.service";
import CreateAppointmentForm from "../CreateAppointmentForm/CreateAppointmentForm"; // Import component
import appointmentService from "../../services/appointment.service";
import Toast from "./../../utils/Toast";
import { useNavigate } from "react-router-dom";
import connectionService from "../../services/connection.service";
import socket from "../../configs/socket/socket";

function UserCard({ avatar, name, address, skills, userid }) {
  const navigate = useNavigate();
  const [chatRoomId, setChatRoomId] = useState(null);

  const [connectionStatus, setConnectionStatus] = useState(null); // "pending_sent", "pending_received", "connected", "none"
  const [connectionId, setConnectionId] = useState(null);
  const [isReceivedRequest, setIsReceivedRequest] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State cho modal

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

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const UserIds = await userService.getUserIDs();
        setUserIds(UserIds.data?.userIds || []);
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    };
    fetchUserIds();
  }, []);

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
      setIsReceivedRequest(false); // Cập nhật UI ngay lập tức
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

  const isConnected = userIds.includes(userid);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAppointmentSubmit = async (appointmentData) => {
    try {
      const requestData = {
        receiverId: userid, // Sử dụng userid từ props
        startTime: new Date(appointmentData.startTime).toISOString(), // Chuyển đổi thành ISO string
        endTime: new Date(appointmentData.endTime).toISOString(), // Chuyển đổi thành ISO string
        description: appointmentData.description
      };
      const response = await appointmentService.createAppointment(requestData);

      if (response) {
        socket.emit("send-notify-book-appointment", requestData.receiverId);
        Toast.fire({
          icon: "success",
          title: response.message
        });
        setIsModalOpen(false);
      } else {
        Toast.fire({
          icon: "error",
          title: response.message
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch hẹn:", error);
    } finally {
      setIsModalOpen(false);
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
            <button className={styles.connectButton} onClick={handleOpenModal}>
              Đặt lịch
            </button>
            <button className={styles.connectButton} onClick={handleChat}>
              Nhắn tin
            </button>
          </div>
        ) : connectionStatus === "pending_sent" ? (
          <button
            className={styles.connectButton}
            onClick={handleCancelRequest}
          >
            Hủy yêu cầu
          </button>
        ) : connectionStatus === "pending_received" ? (
          <div className={styles.chat}>
            <button
              className={styles.connectButton}
              onClick={handleAcceptRequest}
            >
              Chấp nhận
            </button>
            <button
              className={styles.connectButton}
              onClick={handleRejectRequest}
            >
              Từ chối
            </button>
          </div>
        ) : (
          <button className={styles.connectButton} onClick={handleConnect}>
            Kết nối
          </button>
        )}
      </div>

      {/* Hiển thị modal nếu isModalOpen là true */}
      <CreateAppointmentForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAppointmentSubmit}
      />
    </div>
  );
}

export default UserCard;
