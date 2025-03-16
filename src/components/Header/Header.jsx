// eslint-disable-next-line no-unused-vars
import React from "react";
import styles from "./Header.module.css";
import logo from "/skill_exchange_logo.svg";
import { FaHome, FaSearch, FaCalendar, FaUserFriends } from "react-icons/fa";
import RegisterButton from "../RegisterButton";

function Header() {
  const isMobile = window.innerWidth <= 768;
  const currentPath = window.location.pathname; // Lấy đường dẫn hiện tại
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
          <a href="/" className={currentPath === "/" ? styles.active : ""}>
            <FaHome />
            <span>Trang chủ</span>
          </a>
        </li>
        <li>
          <a
            href="/search"
            className={currentPath === "/search" ? styles.active : ""}
          >
            <FaSearch />
            Tìm kiếm
          </a>
        </li>
        <li>
          <a
            href="/calendar"
            className={currentPath === "/calendar" ? styles.active : ""}
          >
            <FaCalendar />
            Lịch
          </a>
        </li>
        <li>
          <a
            href="/network"
            className={currentPath === "/network" ? styles.active : ""}
          >
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
