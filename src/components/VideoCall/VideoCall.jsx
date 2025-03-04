import React from "react";
import styles from "./VideoCall.module.css";
import logo from "../../assets/logo.svg"; 
import catImage from "../../assets/1.png"; 
import shinImage from "../../assets/9.png"; 
import { FaMicrophone, FaVideo, FaDesktop } from "react-icons/fa"; // Import icon từ react-icons

const VideoCall = () => {
    return (
        <div className={styles.videoCallContainer}>
            {/* Header với logo và nút Quay lại */}
            <div className={styles.header}>
                <img src={logo} alt="Skill Exchange Logo" className={styles.logo} />
                <button className={styles.backButton}>Quay lại</button>
            </div>

            {/* Khu vực hiển thị video call */}
            <div className={styles.videoCallContent}>
                {/* Bên trái: Nhân vật mèo */}
                <div className={styles.videoFrame}>
                    <img src={catImage} alt="Cat in video call" className={styles.videoImage} />
                </div>

                {/* Bên phải: Nhân vật Shin */}
                <div className={styles.videoFrame}>
                    <img src={shinImage} alt="Shin in video call" className={styles.videoImage} />
                </div>
            </div>

            {/* Thanh công cụ dưới cùng */}
            <div className={styles.toolbar}>
                <button className={styles.toolbarButton}>
                    <FaMicrophone />
                </button> {/* Micro */}
                <button className={styles.toolbarButton}>
                    <FaVideo />
                </button> {/* Camera */}
                <button className={styles.toolbarButton}>
                    <FaDesktop />
                </button> {/* Chia sẻ màn hình */}
            </div>
        </div>
    );
};

export default VideoCall;