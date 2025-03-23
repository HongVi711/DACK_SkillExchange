import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Hoặc bất kỳ thư viện date picker nào bạn thích
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CreateAppointmentForm.module.css";
import Toast from "../../utils/Toast";

const CreateAppointmentForm = ({ isOpen, onClose, onSubmit }) => {
  const [startTime, setstartTime] = useState(new Date());
  const [endTime, setendTime] = useState(new Date());
  const [description, setDescription] = useState("");

  if (!isOpen) {
    return null; // Ẩn component nếu không mở
  }

  const reset = () => {
    setstartTime(new Date());
    setendTime(new Date());
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate dữ liệu nếu cần thiết
    if (!startTime || !endTime || !description) {
      Toast.fire({
        icon: "error",
        title: "Vui lòng điền đầy đủ thông tin!"
      });
      return;
    }

    // Gọi hàm onSubmit (truyền từ component cha) để xử lý dữ liệu
    onSubmit({ startTime, endTime, description });
    reset();
    // Đóng modal sau khi submit
    onClose();
  };

  return (
    <div className={styles.modal}>
      {" "}
      {/* Thêm class 'modal' để định dạng CSS */}
      <div className={styles.modalContent}>
        {" "}
        {/* Thêm class 'modal-content' để định dạng CSS */}
        <span className={styles.close} onClick={onClose}>
          ×
        </span>{" "}
        {/* Thêm class 'close' để định dạng CSS */}
        <h2>Đặt Lịch Hẹn</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Ngày giờ bắt đầu:</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setstartTime(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy hh:mm aa"
            />
          </div>
          <div>
            <label>Ngày giờ kết thúc:</label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setendTime(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy hh:mm aa"
            />
          </div>
          <div>
            <label>Nội dung:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Đặt Lịch</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentForm;
