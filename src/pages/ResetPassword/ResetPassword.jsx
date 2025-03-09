import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../services/auth.service"; // Import service
import styles from "./ResetPassword.module.css";
import Toast from "../../utils/Toast";
// Import icon từ react-icons (hoặc bạn có thể dùng hình ảnh riêng)
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State cho ẩn/hiện mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State cho ẩn/hiện xác nhận mật khẩu
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Toast.fire({
        icon: "error",
        title: "Xác nhận mật khẩu và mật khẩu không trùng nhau!",
      });
      return;
    }

    const formData = { password, confirmPassword }; // Tạo object formData
    const result = await authService.resetPassword(token, formData); // Gọi service với axios

    if (result.success) {
      // Reset form khi thành công
      setNewPassword("");
      setPasswordConfirm("");
      Toast.fire({
        icon: "success",
        title: "Thay đổi mật khẩu thành công!",
      });
      navigate("/");
    } else {
      // Hiển thị Toast khi có lỗi
      Toast.fire({
        icon: "error",
        title: result.message,
      });
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.resetContainer}>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.inputCustom}
              type={showPassword ? "text" : "password"} // Toggle type dựa trên showPassword
              placeholder="New Password"
              value={password}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className={styles.inputWrapper}>
            <input
              className={styles.inputCustom}
              type={showConfirmPassword ? "text" : "password"} // Toggle type dựa trên showConfirmPassword
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button className={styles.buttonCustom} type="submit">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
