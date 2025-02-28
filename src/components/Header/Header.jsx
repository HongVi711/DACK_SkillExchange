// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaBell, FaUser } from 'react-icons/fa';
function Header() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <span className={styles.logoText}>Skill&nbsp;Exchange</span>
            </div>
            <ul className={styles.navbar}>
                <li><a href="#"><FaHome />Home</a></li>
                <li><a href="#"><FaSearch />About</a></li>
                <li><a href="#"><FaBell />Services</a></li>
                <li><a href="#"><FaUser />Contact</a></li>
            </ul>
            <button onClick={handleLoginClick} className={styles.loginButton}>
                Đăng&nbsp;nhập
            </button>
        </div >
    );
}
export default Header;