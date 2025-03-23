import React, { useEffect, useState } from "react";
import styles from "./ScheduleCard.module.css";
import authService from "./../../services/auth.service";
import userService from "../../services/user.service";

const ScheduleCard = ({ lesson, onUpdateStatus }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userName = await userService.getName(lesson?.senderId);
        setCurrentUser(user);
        setName(userName?.data?.name);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
      }
    };

    fetchCurrentUser();
  }, [lesson?._id]); // Chỉ chạy một lần khi component mount

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
          Thời gian học: {lesson.date} {lesson.time}
        </p>
        <p>
          Thời gian yêu cầu:{" "}
          {new Date(lesson.createdAt).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })}
        </p>
        <p>Người yêu cầu: {name}</p>
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
