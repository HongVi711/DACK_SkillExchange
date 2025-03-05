// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUser } from 'react-icons/fa';
function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Link to="/">
                    <img src={logo} alt="Logo" className={styles.logo} />
                </Link>
                <Link to="/" className={styles.logoText}>Skill&nbsp;Exchange</Link>
            </div>
            {/* <img src={logo} alt="Logo" className={styles.logo} /> */}
            <ul className={styles.navbar}>
                <li>
                    <Link to="/">
                        <FaHome />
                        <span>Trang chủ</span>
                    </Link>
                </li>
                <li>
                <Link to="/search">
                        <FaSearch />
                        <span>Tìm kiếm</span>
                    </Link>
                </li>
                <li>
                <Link to="/schedule">
                        <FaBell />
                        <span>Lịch học</span>
                    </Link>
                </li>
                <li>
                <Link to="/connect">
                        <FaUser />
                        <span>Kết nối</span>
                    </Link>
                </li>
            </ul>
            <button onClick={handleLoginClick} className={styles.loginButton}>
                Đăng&nbsp;nhập
            </button>
        </div >
    );
}
export default Header;