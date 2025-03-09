/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import Header from "../../components/Header"; // Import Header
import styles from "./Login.module.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      navigate("/"); // Chuyển hướng
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.Login}>
      <div className={styles.loginContainer}>
        {/* Sử dụng Header từ HomePage */}
        <Header />
        {/* Phần chứa ảnh và form */}
        <div className={styles.content}>
          {/* Cột bên trái: Hình minh hoạ */}

          {/* Cột bên phải: Form đăng nhập */}
          <div className={styles.formSection}>
            {/* Header */}
            <div className={styles.formHeader}>
              <h2>Đăng nhập</h2>
            </div>
            <div className={styles.formBody}>
              <form id="formLogin" onSubmit={handleLogin}>
                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      id="email"
                      placeholder="Nhập email..."
                      onChange={handleEmailChange}
                      value={email}
                    />
                    <span className={styles.inputIcon}>
                      <FaEnvelope />
                    </span>
                  </div>
                </div>

                {/* Mật khẩu */}
                <div className={styles.formGroup}>
                  <label htmlFor="password">Mật khẩu</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="password"
                      id="password"
                      placeholder="Nhập mật khẩu..."
                      onChange={handlePasswordChange}
                      value={password}
                    />
                    <span className={styles.inputIcon}>
                      <FaLock />
                    </span>
                  </div>
                </div>

                {/* Link đăng ký */}
                <p className={styles.registerText}>
                  Bạn chưa có mật khẩu?
                  <Link to="/register" className={styles.registerLink}>
                    {" "}
                    {/* Dùng <Link> */}
                    <u>Đăng ký ngay tại đây nhé!</u>
                  </Link>
                </p>
              </form>
            </div>

            {/* Footer */}
            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.loginButton}
                onClick={() =>
                  document.getElementById("formLogin").requestSubmit()
                }
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
