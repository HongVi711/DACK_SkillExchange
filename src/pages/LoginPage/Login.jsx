/* eslint-disable no-unused-vars */
import React from 'react';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

function LoginPage() {
    return (
        <div className="loginContainer">
            {/* Header */}
            <div className="appHeader">
                <div className="logoContainer">
                    <Link to={"/"}>
                    <img src={logo} alt="Logo" className="logo" />
                    <span className="logoText">Skill Exchange</span>
                    </Link>
                </div>
            </div>

            {/* Phần chứa ảnh và form */}
            <div className="content">
                {/* Cột bên trái: Hình minh hoạ */}
                <div className="imageSection">
                    <img
                        src="https://s3-alpha-sig.figma.com/img/5188/8abd/0c243b94019540f8bad3682b9f3e9f62?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eKM~UhxXFJPzKD-bWW4VSHU9Q7~hDDQECdKYxXtmevx00DYp0DrSwldVeaF3YaeA1oOeQHmr5aIzu6t1c8qYAmYebKAfg7T9jGaBzz7mCh5YhyGK84WAEWVDM2SJo6~dAM5Yfdt6iGaqVeiZlyM6~tNAlkIbMWbaSELQd4GItl2GEdbBXHPbEGhzG69-ljC90zAaqo4MHaYF53usdV6ageHwf7pfEJ99GsKgonNn81wFKsqV7SpU1LICzFsuUiDrVEzElF0Vwp63H4tWS1HDXoC51jIcSsR6kJqUy4fXGC~a4cU1h6cg7EhPJvWV~vmdJsMg1oAQ8VjJ0BquCsx-nw__"
                        alt="Login Illustration"
                        className="loginImage"
                    />
                </div>

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
                                    />
                                    <span className="inputIcon"><FaLock /></span>

                                </div>
                            </div>

                            {/* Link đăng ký */}
                            <p className="registerText">
                                Bạn chưa có mật khẩu?&nbsp;
                                <Link to="/register" className="registerLink"> {/* Dùng <Link> */}
                                    <u>Đăng ký ngay tại đây nhé!</u>
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="formFooter">
                        <button type="button" className="loginButton">
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;