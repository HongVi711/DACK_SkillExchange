/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Register.css"; // Import CSS thông thường
import { FaEnvelope, FaLock, FaUser, FaIdCard } from "react-icons/fa";
import logo from "../assets/logo.svg"; // Không cần nữa, xóa đi
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import Header from "../components/Header"; // Import Header

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
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
        fullName,
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
    <div className="registerContainer">
      {/* Header */}
      <Header /> {/* Dùng Header */}
      {/* Xóa phần header cũ này đi
            <div className="register-appHeader">
                <div className="register-logoContainer">
                    <Link to={"/"}>
                        <img src={logo} alt="Logo" className="register-logo" />
                        <span className="register-logoText">Skill Exchange</span>
                    </Link>
                </div>
            </div>
            */}
      {/* Phần chứa ảnh và form */}
      <div className="content">
        {/* Cột bên trái: Hình minh hoạ */}
        <div className="imageSection">
          <img
            src="https://s3-alpha-sig.figma.com/img/5188/8abd/0c243b94019540f8bad3682b9f3e9f62?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eKM~UhxXFJPzKD-bWW4VSHU9Q7~hDDQECdKYxXtmevx00DYp0DrSwldVeaF3YaeA1oOeQHmr5aIzu6t1c8qYAmYebKAfg7T9jGaBzz7mCh5YhyGK84WAEWVDM2SJo6~dAM5Yfdt6iGaqVeiZlyM6~tNAlkIbMWbaSELQd4GItl2GEdbBXHPbEGhzG69-ljC90zAaqo4MHaYF53usdV6ageHwf7pfEJ99GsKgonNn81wFKsqV7SpU1LICzFsuUiDrVEzElF0Vwp63H4tWS1HDXoC51jIcSsR6kJqUy4fXGC~a4cU1h6cg7EhPJvWV~vmdJsMg1oAQ8VjJ0BquCsx-nw__"
            alt="Register Illustration"
            className="loginImage"
          />
        </div>

        {/* Cột bên phải: Form đăng ký */}
        <div className="formSection">
          {/* Header của form */}
          <div className="formHeader">
            <h2>Đăng ký tài khoản</h2>
          </div>
          <div className="formBody">
            <form onSubmit={handleSubmit}>
              {/* Tên hiển thị */}
              <div className="formGroup">
                <label htmlFor="fullName">Tên hiển thị</label>
                <div className="inputWrapper">
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Nhập tên hiển thị..."
                    value={fullName}
                    onChange={handleFullNameChange}
                    required
                  />
                  <span className="inputIcon">
                    <FaIdCard />
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="formGroup">
                <label htmlFor="email">Email</label>
                <div className="inputWrapper">
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập email..."
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  <span className="inputIcon">
                    <FaEnvelope />
                  </span>
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="formGroup">
                <label htmlFor="password">Mật khẩu</label>
                <div className="inputWrapper">
                  <input
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span className="inputIcon">
                    <FaLock />
                  </span>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="formGroup">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="inputWrapper">
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu..."
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  <span className="inputIcon">
                    <FaUser />
                  </span>
                </div>
              </div>

              {/* Link đăng nhập */}
              <p className="registerText">
                Bạn đã có tài khoản?&nbsp;
                <Link to="/login" className="registerLink">
                  Đăng nhập ngay!
                </Link>
              </p>
            </form>
          </div>
          {/* Nút đăng ký */}
          <div className="formFooter">
            <button type="submit" className="registerButton">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
