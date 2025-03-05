/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./Register.module.css"; // Import CSS thông thường
import { FaEnvelope, FaLock, FaUser, FaIdCard } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFullNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await authService.register(
        name,
        email,
        password,
        confirmPassword
      );
      navigate("/login"); // Chuyen huong den trang dang nhap
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      {/* Header */}
      <div className={styles.appHeader}>
        <div className={styles.logoContainer}>
          <Link to={"/"}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <span className={styles.logoText}>Skill Exchange</span>
          </Link>
        </div>
      </div>

      {/* Phần chứa ảnh và form */}
      <div className={styles.content}>
        {/* Cột bên trái: Hình minh hoạ */}
        <div className={styles.imageSection}>
          <img
            src="https://s3-alpha-sig.figma.com/img/5188/8abd/0c243b94019540f8bad3682b9f3e9f62?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eKM~UhxXFJPzKD-bWW4VSHU9Q7~hDDQECdKYxXtmevx00DYp0DrSwldVeaF3YaeA1oOeQHmr5aIzu6t1c8qYAmYebKAfg7T9jGaBzz7mCh5YhyGK84WAEWVDM2SJo6~dAM5Yfdt6iGaqVeiZlyM6~tNAlkIbMWbaSELQd4GItl2GEdbBXHPbEGhzG69-ljC90zAaqo4MHaYF53usdV6ageHwf7pfEJ99GsKgonNn81wFKsqV7SpU1LICzFsuUiDrVEzElF0Vwp63H4tWS1HDXoC51jIcSsR6kJqUy4fXGC~a4cU1h6cg7EhPJvWV~vmdJsMg1oAQ8VjJ0BquCsx-nw__"
            alt="Register Illustration"
            className={styles.loginImage}
          />
        </div>

        {/* Cột bên phải: Form đăng ký */}
        <div className={styles.formSection}>
          {/* Header của form */}
          <div className={styles.formHeader}>
            <h2>Đăng ký tài khoản</h2>
          </div>
          <div className={styles.formBody}>
            <form onSubmit={handleSubmit}>
              {/* Tên hiển thị */}
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Tên hiển thị</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Nhập tên hiển thị..."
                    value={name}
                    onChange={handleFullNameChange}
                    required
                  />
                  <span className={styles.inputIcon}>
                    <FaIdCard />
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập email..."
                    value={email}
                    onChange={handleEmailChange}
                    required
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
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span className={styles.inputIcon}>
                    <FaLock />
                  </span>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu..."
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <span className={styles.inputIcon}>
                    <FaUser />
                  </span>
                </div>
              </div>

              {/* Link đăng nhập */}
              <p className={styles.registerText}>
                Bạn đã có tài khoản?&nbsp;
                <a href="/login" className={styles.registerLink}>
                  Đăng nhập ngay!
                </a>
              </p>
            </form>
          </div>
          {/* Nút đăng ký */}
          <div className={styles.formFooter}>
            <button type="submit" className={styles.registerButton}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
