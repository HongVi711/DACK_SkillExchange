// src/components/Avatar/Avatar.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./Avatar.module.css";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function Avatar({ user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    authService
      .getAvatar()
      .then((response) => {
        if (response && response.data) {
          setAvatar(response.data.image); // Dùng trực tiếp Base64
        }
      })
      .catch((error) => {
        console.log("Lỗi khi lấy ảnh:", error);
      });
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout(); // Đợi logout hoàn tất
      if (typeof onLogout === "function") {
        onLogout(); // Gọi callback nếu hợp lệ
      }
      navigate("/"); // Chuyển hướng
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={styles.avatarContainer} ref={dropdownRef}>
      <img
        src={avatar || "default-avatar.png"} // Sử dụng optional chaining để tránh lỗi nếu user là null
        alt="Avatar"
        className={styles.avatar}
        onClick={toggleDropdown}
      />

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <a
            href={`/profile`}
            onClick={(e) => {
              e.preventDefault(); // Ngăn điều hướng mặc định
              setIsDropdownOpen(false);
              navigate(`/profile`, { state: { user } });
            }}
          >
            Thông tin cá nhân
          </a>
          <a
            href="/change-password"
            onClick={() => {
              setIsDropdownOpen(false);
              navigate("/change-password");
            }}
          >
            Đổi mật khẩu
          </a>
          <button
            onClick={() => {
              handleLogout();
              setIsDropdownOpen(false);
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default Avatar;
