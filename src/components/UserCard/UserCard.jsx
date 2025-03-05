/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/UserCard/UserCard.jsx
import React from 'react';
import styles from './UserCard.module.css';

function UserCard({ avatar, name, job, learn, day, major }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <button className={styles.closeBtn}>X</button>
        <img src={avatar} alt={name} className={styles.cardAvatar} />
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardJob}>{job}</p>
        <p className={styles.cardMajor}>
          Dạy: <span>{major}</span>
        </p>
        <p className={styles.cardLearn}>
          Muốn học: <span>{learn}</span>
        </p>

        <button className={styles.connectButton}>Kết nối</button> {/* Sửa tên class */}
      </div>
    </div>
  );
}

export default UserCard;