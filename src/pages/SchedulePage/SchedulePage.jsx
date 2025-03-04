import React, { useState } from "react";
import styles from "./SchedulePage.module.css";
import Header from "../../components/Header";
import ScheduleCard from "../../components/ScheduleCard/ScheduleCard";

const formatDate = (date) => date.toLocaleDateString("en-CA");

const getFormattedDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return formatDate(date);
};

// Dữ liệu mẫu
const initialScheduleData = [
    { title: "Lập trình Python", teacher: "Nguyễn Văn B", date: getFormattedDate(0), time: "12:30 PM", status: "Chờ xác nhận" },
    { title: "Lập trình Java", teacher: "Trần Văn A", date: getFormattedDate(1), time: "3:00 PM", status: "Đã hoàn thành" },
    { title: "Lập trình C++", teacher: "Lê Thị C", date: getFormattedDate(2), time: "4:30 PM", status: "Đã hủy" },
];

const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState("Tất cả");
    const [scheduleData, setScheduleData] = useState(initialScheduleData);

    // Hàm cập nhật trạng thái buổi học
    const updateLessonStatus = (lesson, newStatus) => {
        setScheduleData((prevData) =>
            prevData.map((item) =>
                item === lesson ? { ...item, status: newStatus } : item
            )
        );
    };

    // Lấy danh sách ngày trong tháng
    const getDaysInMonth = () => {
        const days = [];
        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

        for (let i = 1; i <= lastDay; i++) {
            const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
            days.push({
                day: i,
                weekday: currentDate.toLocaleString("vi-VN", { weekday: "short" }).toUpperCase(),
                date: formatDate(currentDate),
            });
        }
        return days;
    };

    // Chia danh sách ngày thành các tuần (mỗi tuần 7 ngày)
    const chunkDaysIntoWeeks = (days) => {
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    };

    // Lọc các buổi học theo ngày và trạng thái
    const filteredLessons = scheduleData.filter((lesson) => {
        const selectedFormattedDate = formatDate(selectedDate);
        const isSameDate = lesson.date === selectedFormattedDate;
        const isSameStatus = filterStatus === "Tất cả" || lesson.status === filterStatus;

        return filterStatus === "Tất cả" ? true : isSameDate && isSameStatus;
    });

    const daysInMonth = getDaysInMonth();
    const weeks = chunkDaysIntoWeeks(daysInMonth);

    // Hàm điều hướng tháng
    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    return (
        <div className={styles.scheduleContainer}>
            <Header />
            <h1 className={styles.scheduleTitle}>Lịch học</h1>

            {/* Bộ lọc trạng thái */}
            <div className={styles.filterContainer}>
                <label>Bộ lọc: </label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="Tất cả">Tất cả</option>
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
            </div>

            {/* Lịch dạng danh sách chia thành các tuần */}
            <div className={styles.calendarContainer}>
                <div className={styles.monthNavigation}>
                    <button onClick={prevMonth}>{'<'}</button>
                    <span>
                        Tháng {selectedDate.getMonth() + 1} năm {selectedDate.getFullYear()}
                    </span>
                    <button onClick={nextMonth}>{'>'}</button>
                </div>
                <div className={styles.weeksContainer}>
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className={styles.weekRow}>
                            {week.map((day) => {
                                const lessonsOnDate = scheduleData.filter((l) => l.date === day.date);
                                let tileClass = "";
                                if (lessonsOnDate.length > 0) {
                                    if (lessonsOnDate.some((l) => l.status === "Chờ xác nhận")) tileClass = styles.pendingClass;
                                    else if (lessonsOnDate.some((l) => l.status === "Đã hoàn thành")) tileClass = styles.completedClass;
                                    else if (lessonsOnDate.some((l) => l.status === "Đã hủy")) tileClass = styles.canceledClass;
                                }
                                const isSelected =
                                    day.day === selectedDate.getDate() &&
                                    selectedDate.getMonth() === new Date().setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                                return (
                                    <div
                                        key={day.day}
                                        className={`${styles.dayTile} ${tileClass} ${isSelected ? styles.selected : ""}`}
                                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day.day))}
                                    >
                                        <span className={styles.weekday}>{day.weekday}</span>
                                        <span className={styles.dayNumber}>{day.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Danh sách buổi học */}
            <div className={styles.scheduleList}>
                <h2>Chi tiết buổi học</h2>
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                        <ScheduleCard key={index} lesson={lesson} onUpdateStatus={updateLessonStatus} />
                    ))
                ) : (
                    <p className={styles.noLesson}>Không có buổi học nào.</p>
                )}
            </div>
        </div>
    );
};

export default SchedulePage;