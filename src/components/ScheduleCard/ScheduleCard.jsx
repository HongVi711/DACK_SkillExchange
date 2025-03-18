import React, { useEffect, useState } from "react";
import styles from "./ScheduleCard.module.css";
import authService from "./../../services/auth.service";

const ScheduleCard = ({ lesson, onUpdateStatus }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
      }
    };

    fetchCurrentUser();
  }, []); // Chỉ chạy một lần khi component mount

  const handleConfirm = () => {
    onUpdateStatus(lesson, "accepted");
  };

  const handleCancel = () => {
    onUpdateStatus(lesson, "rejected");
  };

  return (
    <div
      className={`${styles.card} ${styles[lesson.status.replace(/\s/g, "")]}`}
    >
      <div className={styles.cardHeader}>
        <div>
          <strong>Buổi học: </strong>
          <span>{lesson.description}</span>
        </div>
        <span className={styles.statusLabel}>{lesson.status}</span>
      </div>
      <div className={styles.cardContent}>
        <p>
          Thời gian: {lesson.date} {lesson.time}
        </p>
      </div>
      {/* Hiển thị nút nếu trạng thái là "Chờ xác nhận" */}
      {lesson.status === "Chờ xác nhận" && (
        <div className={styles.actionButtons}>
          {currentUser?.data?.user?._id === lesson.receiverId && (
            <button className={styles.confirmButton} onClick={handleConfirm}>
              Xác nhận
            </button>
          )}
          <button className={styles.cancelButton} onClick={handleCancel}>
            Hủy lịch
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
