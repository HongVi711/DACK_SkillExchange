/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/UserCard/UserCard.jsx
import React from "react";
import styles from "./UserCard.module.css";

function UserCard({ avatar, name, address, skills }) {
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
        <button className={styles.connectButton}>Kết nối</button>{" "}
      </div>
    </div>
  );
}

export default UserCard;
