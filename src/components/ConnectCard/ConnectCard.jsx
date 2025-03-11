/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from './ConnectCard.module.css';
import { useNavigate } from "react-router-dom";

function ConnectCard({ avatar, name, address, skills, userid, status ,onCancelRequest, onMessage,user  }) {
    const navigate = useNavigate();

    const handleMessage = () => {
      navigate(`/chat/${userid}`); // Chuyển hướng đến trang nhắn tin
    };
  
    return (
      <div className={styles.card}>
         <img src={avatar.data?.image}
                alt={name}
                className={styles.cardAvatar} /> 
            <div className={styles.info}>
                <h3>{name}</h3>
                <p>Kỹ năng: {skills}</p>
                <p>Địa chỉ: {address}</p>
            </div>    
        
  
            {/* Button theo trạng thái */}
            {status === "friend" ? (
                <button className={styles.actionButton} onClick={() => onMessage(user._id)}>
                    Nhắn tin
                </button>
            ) : status === "pending" ? (
                <button className={styles.cancelButton} onClick={() => onCancelRequest(user._id)}>
                    Hủy yêu cầu
                </button>
            ) : null}
        </div>
    );
  }
// const ConnectCard = ({ user, avatar, status, onCancelRequest, onMessage }) => {
//     return (
//       <div className={styles.card}>
//         <img src={avatar} alt="Avatar" className={styles.avatar} />
//         <div className={styles.info}>
//           <h3>{user.name}</h3>
//           <p><strong>Kỹ năng:</strong> {user.skills?.length ? user.skills.map(s => s.name).join(", ") : "Chưa có kỹ năng"}</p>
//           <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật địa chỉ"}</p>
//         </div>
  
//         {/* Hiển thị button dựa vào trạng thái */}
//         {status === "friend" ? (
//           <button className={styles.actionButton} onClick={() => onMessage(user._id)}>
//             Nhắn tin
//           </button>
//         ) : status === "pending" ? (
//           <button className={styles.cancelButton} onClick={() => onCancelRequest(user._id)}>
//             Hủy yêu cầu
//           </button>
//         ) : null}
//       </div>
//     );
//   };

export default ConnectCard;