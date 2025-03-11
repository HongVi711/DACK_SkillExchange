/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import connectionService from "../../services/connection.service";
import ConnectCard from "../../components/ConnectCard";
import styles from "../Connect/Connect.module.css"; 

const ConnectionPage = () => {
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [photos, setPhotos] = useState({});
  const [activeTab, setActiveTab] = useState("friends"); // "friends" hoặc "requests"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsData, sentRequestsData] = await Promise.all([
          connectionService.getFriends(),
          connectionService.getSentRequests(),
        ]);

        setFriends(friendsData);
        setSentRequests(sentRequestsData);

        const users = [...friendsData, ...sentRequestsData.map(req => req.receiverId)];
        const photoMap = Object.fromEntries(
          await Promise.all(
            users.map(async (user) => [user._id, await connectionService.getAvatarUser(user._id)])
          )
        );
        setPhotos(photoMap);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleCancelRequest = async (userId) => {
    try {
      await connectionService.cancelRequest(userId);
      setSentRequests((prev) => prev.filter((req) => req.receiverId._id !== userId));
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu kết nối:", error);
    }
  };

  const handleMessage = (userId) => {
    console.log("Chuyển đến cuộc trò chuyện với:", userId);
  };

  return (
    <div className={styles.friendsContainer}>
      {/* Nút chuyển đổi danh sách */}
      <div className={styles.tabButtons}>
        <button 
          className={activeTab === "friends" ? styles.active : ""}
          onClick={() => setActiveTab("friends")}
        >
          Bạn bè
        </button>
        <button 
          className={activeTab === "requests" ? styles.active : ""}
          onClick={() => setActiveTab("requests")}
        >
          Yêu cầu đã gửi
        </button>
      </div>

      {/* Hiển thị danh sách theo tab đang chọn */}
      <div className={styles.list}>
        {activeTab === "friends" ? (
          friends.length > 0 ? (
            friends.map((user) => (
              <ConnectCard
                key={user._id}
                name={user.name}
                skills={user.skills?.length ? user.skills.map(s => s.name).join(", ") : "Chưa có kỹ năng"}
                address={user.address || "Chưa cập nhật địa chỉ"}
                avatar={photos[user._id] || "default-avatar-url"}
                userid={user._id}
                status="friend"
                onCancelRequest={handleCancelRequest}
                onMessage={handleMessage}
              />
            ))
          ) : (
            <p>Bạn chưa kết nối với ai.</p>
          )
        ) : (
          sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <ConnectCard
                key={req.receiverId._id}
                name={req.receiverId.name}
                skills={req.receiverId.skills?.length ? req.receiverId.skills.map(s => s.name).join(", ") : "Chưa có kỹ năng"}
                address={req.receiverId.address || "Chưa cập nhật địa chỉ"}
                avatar={photos[req.receiverId._id] || "default-avatar-url"}
                userid={req.receiverId._id}
                status="pending"
                onCancelRequest={handleCancelRequest}
                onMessage={handleMessage}
              />
            ))
          ) : (
            <p>Bạn chưa gửi yêu cầu kết nối nào.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ConnectionPage;









