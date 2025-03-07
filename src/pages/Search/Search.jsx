/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import UserCard from "../../components/UserCard";
import styles from "../Search/Search.module.css";
import userService from "../../services/user.service"; // Điều chỉnh đường dẫn import
import Loading from "./../../components/Loading/index";

function SearchPage() {
  const [skillName, setSkillName] = useState(""); // Đổi tên setSearchTerm thành setSkillname cho đồng bộ
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      const photoPromises = users.map(async (user) => {
        const avatar = await userService.getAvatarUser(user._id);
        return { id: user._id, avatar };
      });

      const photoResults = await Promise.all(photoPromises);
      const photoMap = photoResults.reduce((acc, { id, avatar }) => {
        acc[id] = avatar;
        return acc;
      }, {});
      setPhotos(photoMap);
    };

    fetchPhotos();
  }, [users]); // Re-run when users array changes

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    // Tạo object params để gửi request
    const params = {};
    if (skillName) params.skillName = skillName;
    if (selectedProvince) {
      const province = provinces.find(
        (p) => p.code === parseInt(selectedProvince)
      );
      params.address = province?.name;
    }
    if (selectedOptions.length > 0) params.skills = selectedOptions.join(",");

    try {
      const data = await userService.searchUser(params);
      if (data.status === "success") {
        setUsers(data.data.users);
      } else {
        setError("Không thể tải dữ liệu");
      }
    } catch (err) {
      if (err.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        // Có thể thêm logic để redirect về trang login
      } else {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  // Gửi request khi trang load
  useEffect(() => {
    fetchUsers();
  }, []); // Mảng rỗng để chỉ chạy 1 lần khi mount

  return (
    <>
      <div className={styles.searchContainer}>
        <h1 className={styles.title}>Tìm kiếm người trao đổi kỹ năng</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Nhập kỹ năng bạn muốn học"
            value={skillName} // Đồng bộ với state skillname
            onChange={(e) => setSkillName(e.target.value)} // Sửa setSearchTerm thành setSkillname
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Tìm kiếm
          </button>
        </div>

        <div className={styles.searchFilter}>
          {/* <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.locationSelect}
          >
            <option value="">Tất cả địa điểm</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
          </select> */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="border rounded p-1 ml-2 w-3/4 mt-1"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.wrapper}>
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div>Không tìm thấy kết quả nào</div>
        )}
        {!loading && !error && users.length !== 0 && (
          <div className={styles.cardContainer}>
            {loading && (
              <div
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000, // Đảm bảo nó ở trên cùng
                }}
              >
                <Loading />
              </div>
            )}
            {users.map((user) => (
              <UserCard
                key={user._id}
                name={user.name}
                skills={
                  user.skills.map((skill) => skill.name).join(", ") ||
                  "Chưa có kỹ năng"
                }
                address={user.address}
                avatar={photos[user._id] || "default-avatar-url"} // Fallback image
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchPage;
