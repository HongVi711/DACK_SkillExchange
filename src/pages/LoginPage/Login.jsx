/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { loginUser, removeToken } from '../../services/authService';
import Header from '../../components/Header'; // Import Header


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            const result = await loginUser(email, password);
            localStorage.setItem('token', result.token);
            navigate('/'); // Chuyển hướng

        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="loginContainer">
            {/* Sử dụng Header từ HomePage */}
            <Header />
            {/* Phần chứa ảnh và form */}
            <div className="content">
                {/* Cột bên trái: Hình minh hoạ */}
                

                {/* Cột bên phải: Form đăng nhập */}
                <div className="formSection">
                    {/* Header */}
                    <div className="formHeader">
                        <h2>Đăng nhập</h2>
                    </div>
                    <div className="formBody">
                        <form>
                            {/* Email */}
                            <div className="formGroup">
                                <label htmlFor="email">Email</label>
                                <div className="inputWrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Nhập email..."
                                        onChange={handleEmailChange}
                                        value={email}
                                    />
                                    <span className="inputIcon"><FaEnvelope /></span>

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
                                        onChange={handlePasswordChange}
                                        value={password}
                                    />
                                    <span className="inputIcon"><FaLock /></span>

                                </div>
                            </div>

                            {/* Link đăng ký */}
                            <p className="registerText">
                                Bạn chưa có mật khẩu?
                                <Link to="/register" className="registerLink"> {/* Dùng <Link> */}
                                    <u>Đăng ký ngay tại đây nhé!</u>
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="formFooter">
                    <button type="submit" className="loginButton" onClick={handleLogin}>
                         Đăng nhập
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;