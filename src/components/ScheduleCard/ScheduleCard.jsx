import React from "react";
import styles from "./ScheduleCard.module.css";

const ScheduleCard = ({ lesson, onUpdateStatus }) => {
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
          <button className={styles.cancelButton} onClick={handleCancel}>
            Hủy lịch
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
