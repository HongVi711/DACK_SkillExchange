// eslint-disable-next-line no-unused-vars
import React from "react";
import styles from "./Header.module.css";
import logo from "/skill_exchange_logo.svg";
import { FaHome, FaSearch, FaCalendar, FaUserFriends } from "react-icons/fa";
import RegisterButton from "../RegisterButton";

function Header() {
  return (
    <div className={styles.sidebar}>
      <a href="/">
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <span className={styles.logoText}>Skill&nbsp;Exchange</span>
        </div>
      </a>
      <ul className={styles.navbar}>
        <li>
          <a href="/">
            <FaHome />
            Trang chủ
          </a>
        </li>
        <li>
          <a href="/search">
            <FaSearch />
            Tìm kiếm
          </a>
        </li>
        <li>
          <a href="/calendar">
            <FaCalendar />
            Lịch
          </a>
        </li>
        <li>
          <a href="/network">
            <FaUserFriends />
            Bạn bè
          </a>
        </li>
      </ul>
      <RegisterButton />
    </div>
  );
}
export default Header;
