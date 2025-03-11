import React, { useState, useEffect } from "react";
import styles from "./UserCard.module.css";
import userService from "../../services/user.service";
import CreateAppointmentForm from "../CreateAppointmentForm/CreateAppointmentForm"; // Import component
import appointmentService from "../../services/appointment.service";
import Toast from "./../../utils/Toast";

function UserCard({ avatar, name, address, skills, userid }) {
  const [userIds, setUserIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State cho modal

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
        description: appointmentData.description,
      };
      const response = await appointmentService.createAppointment(requestData);

      if (response) {
        Toast.fire({
          icon: "success",
          title: response.message,
        });
        setIsModalOpen(false);
      } else {
        Toast.fire({
          icon: "error",
          title: response.message,
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
        {isConnected ? (
          <div className={styles.chat}>
            <button className={styles.connectButton} onClick={handleOpenModal}>
              Đặt lịch
            </button>
            <button className={styles.connectButton}>Nhắn tin</button>
          </div>
        ) : (
          <button className={styles.connectButton}>Kết nối</button>
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
