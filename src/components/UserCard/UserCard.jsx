import React, { useState, useEffect } from "react";
import styles from "./UserCard.module.css";
import userService from "../../services/user.service";

function UserCard({ avatar, name, address, skills, userid }) {
  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const UserIds = await userService.getUserIDs();
        setUserIds(UserIds.data?.userIds || []);
      } catch (error) {
        console.error("Error fetching user IDs:", error);
      }
    };
    fetchUserIds();
  }, []);
  // Check if the current userid exists in userIds array
  const isConnected = userIds.includes(userid);
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <img
          src={avatar.data?.image}
          alt={name}
          className={styles.cardAvatar}
        />
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardMajor}>
          Kỹ năng: <span>{skills}</span>
        </p>
        <p className={styles.cardLearn}>
          Địa chỉ: <span>{address}</span>
        </p>
        {isConnected ? (
          <button className={styles.connectButton}>Nhắn tin</button>
        ) : (
          <button className={styles.connectButton}>Kết nối</button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
