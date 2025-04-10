import React, { useState, useEffect } from "react";
import styles from "./Schedule.module.css";
import ScheduleCard from "../../components/ScheduleCard";
import appointmentService from "../../services/appointment.service";
import Toast from "../../utils/Toast";
import socket from "../../configs/socket/socket";

const formatDate = (date) => date.toLocaleDateString("vi-VN");

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [scheduleData, setScheduleData] = useState([]);

  const fetchScheduleData = async () => {
    // Simulate API response
    const mockApiResponse = await appointmentService.getAppointments();

    const data = mockApiResponse;

    if (data.status === "success") {
      setScheduleData(data.data.appointments);
    } else {
      console.error("Failed to fetch schedule data");
    }
  };

  useEffect(() => {
    fetchScheduleData();
    socket.on("receive-notify-book-appointment", (data) => {
      Toast.fire({
        icon: "info",
        title: data.message || "Bạn có 1 cuộc hẹn mới!"
      });
      fetchScheduleData();
    });
  }, []);

  const updateLessonStatus = async (lesson, newStatus) => {
    const response = await appointmentService.updateStatus(
      newStatus,
      lesson._id
    );

    if (response.status) {
      Toast.fire({
        icon: "success",
        title: response.message
      });
      setScheduleData((prevData) =>
        prevData.map((item) =>
          item._id === lesson._id ? { ...item, status: newStatus } : item
        )
      );
    } else {
      Toast.fire({
        icon: "error",
        title: response.message
      });
    }
  };

  const getDaysInMonth = () => {
    const days = [];
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const lastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= lastDay; i++) {
      const currentDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      );
      days.push({
        day: i,
        weekday: currentDate
          .toLocaleString("vi-VN", { weekday: "short" })
          .toUpperCase(),
        date: formatDate(currentDate)
      });
    }
    return days;
  };

  const chunkDaysIntoWeeks = (days) => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const filteredLessons = scheduleData.filter((lesson) => {
    const selectedFormattedDate = formatDate(selectedDate);
    const lessonDate = formatDate(new Date(lesson.startTime)); // Format lesson date
    const isSameDate = lessonDate === selectedFormattedDate;
    const isSameStatus =
      filterStatus === "Tất cả" || lesson.status === filterStatus;

    if (filterStatus === "Tất cả") {
      return isSameDate;
    } else {
      return isSameDate && isSameStatus;
    }
  });

  const daysInMonth = getDaysInMonth();
  const weeks = chunkDaysIntoWeeks(daysInMonth);

  const prevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const statusMap = {
    pending: "Chờ xác nhận",
    accepted: "Đã hoàn thành",
    rejected: "Đã hủy"
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <label>Bộ lọc: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="accepted">Đã hoàn thành</option>
          <option value="rejected">Đã hủy</option>
        </select>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.monthNavigation}>
          <button onClick={prevMonth}>{"<"}</button>
          <span>
            Tháng {selectedDate.getMonth() + 1} năm {selectedDate.getFullYear()}
          </span>
          <button onClick={nextMonth}>{">"}</button>
        </div>
        <div className={styles.weeksContainer}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.weekRow}>
              {week.map((day) => {
                const lessonsOnDate = scheduleData.filter((l) => {
                  const lessonDate = formatDate(new Date(l.startTime)); // Format lesson date
                  return lessonDate === day.date;
                });

                let tileClass = "";
                if (lessonsOnDate.length > 0) {
                  if (lessonsOnDate.some((l) => l.status === "pending"))
                    tileClass = styles.pendingClass;
                  else if (lessonsOnDate.some((l) => l.status === "accepted"))
                    tileClass = styles.completedClass;
                  else if (lessonsOnDate.some((l) => l.status === "rejected"))
                    tileClass = styles.canceledClass;
                }

                const isSelected = formatDate(selectedDate) === day.date;

                return (
                  <div
                    key={day.day}
                    className={`${styles.dayTile} ${tileClass} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          day.day
                        )
                      )
                    }
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

      <div className={styles.scheduleList}>
        <h2>Chi tiết buổi học</h2>
        {filteredLessons.length > 0 ? (
          filteredLessons.map((lesson, index) => {
            const startTime = new Date(lesson.startTime);
            const endTime = new Date(lesson.endTime); // Lấy từ API nếu có

            const formattedTime = `${Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              timeZone: "Asia/Ho_Chi_Minh" // Bảo đảm giữ múi giờ VN
            }).format(new Date(startTime))} - ${Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              timeZone: "Asia/Ho_Chi_Minh" // Bảo đảm giữ múi giờ VN
            }).format(new Date(endTime))}`;

            return (
              <ScheduleCard
                key={index}
                lesson={{
                  ...lesson,
                  time: formattedTime,
                  status: statusMap[lesson.status] || lesson.status // Translate status
                }}
                onUpdateStatus={updateLessonStatus}
              />
            );
          })
        ) : (
          <p className={styles.noLesson}>Không có buổi học nào.</p>
        )}
      </div>
    </>
  );
};

export default SchedulePage;
