// ChangePassword.js
import React, { useState } from "react";
import styles from "./ChangePassword.module.css"; // Nếu bạn muốn thêm CSS
import authService from "../../services/auth.service";
import Toast from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  // State để quản lý form data
  const [formData, setFormData] = useState({
    passwordCurrent: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra password và confirmPassword có khớp không
    if (formData.password !== formData.confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Mật khẩu mới và xác nhận mật khẩu không khớp!",
      });
      return;
    }

    try {
      // Giả lập API call
      const response = await authService.changePassword(formData);

      if (response.success) {
        Toast.fire({
          icon: "success",
          title: "Đổi mật khẩu thành công, Vui lòng đăng nhập lại!",
        });
        // Reset form
        setFormData({
          passwordCurrent: "",
          password: "",
          confirmPassword: "",
        });
        authService.logout();
        navigate("/");
      } else {
        // Hiển thị Toast khi có lỗi
        Toast.fire({
          icon: "error",
          title: response.message,
        });
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Đã có lỗi xảy ra khi đổi mật khẩu!",
      });
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h2>Đổi Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.labelCustom} htmlFor="passwordCurrent">
            Mật khẩu hiện tại:
          </label>
          <input
            type="password"
            id="passwordCurrent"
            name="passwordCurrent"
            value={formData.passwordCurrent}
            onChange={handleChange}
            required
            className={styles.inputCustom}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.labelCustom} htmlFor="password">
            Mật khẩu mới:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.inputCustom}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.labelCustom} htmlFor="confirmPassword">
            Xác nhận mật khẩu mới:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={styles.inputCustom}
          />
        </div>

        <button className={styles.customButton} type="submit">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
