import React from "react";
import styles from "./ScheduleCard.module.css";

const ScheduleCard = ({ lesson, onUpdateStatus }) => {
    const handleConfirm = () => {
        onUpdateStatus(lesson, "Đã hoàn thành");
    };

    const handleCancel = () => {
        onUpdateStatus(lesson, "Đã hủy");
    };

    return (
        <div className={`${styles.card} ${styles[lesson.status.replace(/\s/g, "")]}`}>
            <div className={styles.cardHeader}>
                <div>
                    <strong>Buổi học: </strong>
                    <span>{lesson.title}</span>
                </div>
                <span className={styles.statusLabel}>{lesson.status}</span>
            </div>
            <div className={styles.cardContent}>
                <p>Giảng viên: {lesson.teacher}</p>
                <p>Thời gian: {lesson.date} - {lesson.time}</p>
            </div>
            {/* Hiển thị nút nếu trạng thái là "Chờ xác nhận" */}
            {lesson.status === "Chờ xác nhận" && (
                <div className={styles.actionButtons}>
                    <button className={styles.cancelButton} onClick={handleCancel}>Hủy lịch</button>
                    <button className={styles.confirmButton} onClick={handleConfirm}>Xác nhận</button>
                </div>
            )}
        </div>
    );
};

export default ScheduleCard;