/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import UserCard from "../../components/UserCard";
import styles from "../Search/Search.module.css";
import userService from "../../services/user.service";
import Loading from "./../../components/Loading/index";

function SearchPage() {
  const [skillName, setSkillName] = useState("");
  const [name, setName] = useState(""); // Thêm state cho name
  const [email, setEmail] = useState(""); // Thêm state cho email
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

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

    if (users.length > 0) {
      fetchPhotos();
    }
  }, [users]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);

    const params = {
      page: page,
      limit: itemsPerPage,
    };
    if (skillName) params.skillName = skillName;
    if (name) params.name = name; // Thêm name vào params
    if (email) params.email = email; // Thêm email vào params
    if (selectedProvince) {
      const province = provinces.find(
        (p) => p.code === parseInt(selectedProvince)
      );
      params.address = province?.name;
    }
    if (selectedOptions.length > 0) params.skills = selectedOptions.join(",");

    try {
      const data = await userService.searchUserInNetwork(params);
      if (data.status === "success") {
        setUsers(data.data.users);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.page);
      } else {
        setError("Không thể tải dữ liệu");
      }
    } catch (err) {
      if (err.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers(1);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <h1 className={styles.title}>Tìm kiếm người trao đổi kỹ năng</h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Nhập kỹ năng bạn muốn học"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Nhập tên người dùng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.searchInput}
          />
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Tìm kiếm
          </button>
        </div>

        <div className={styles.searchFilter}>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className={styles.locationSelect}
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
          <div className={styles.resultsContainer}>
            <div className={styles.cardContainer}>
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  name={user.name}
                  skills={
                    user.skills.length > 0
                      ? user.skills.map((skill) => skill.name).join(", ")
                      : "Chưa có kỹ năng"
                  }
                  address={user.address || "Chưa cập nhật địa chỉ"}
                  avatar={(photos && photos[user._id]) || "default-avatar-url"}
                  userid={user._id}
                />
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Trước
              </button>
              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages}
                (Tổng: {users.length} kết quả)
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Sau
              </button>
            </div>
          </div>
        )}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default SearchPage;
