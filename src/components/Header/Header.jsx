// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.svg'; 
import { FaHome, FaSearch, FaBell, FaUser } from 'react-icons/fa';
function Header(){
    return(
        <div className={styles.sidebar}>   
            <img src={logo} alt="Logo" className={styles.logo} />
            <ul className={styles.navbar}>
                <li><a href="#"><FaHome />Home</a></li>
                <li><a href="#"><FaSearch />About</a></li>
                <li><a href="#"><FaBell />Services</a></li>
                <li><a href="#"><FaUser />Contact</a></li>
            </ul>      
      </div >
    );
}
export default Header;