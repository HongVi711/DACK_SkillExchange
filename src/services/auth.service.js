/* eslint-disable no-unused-vars */
// src/services/auth.service.js
import axios from "axios"; // Hoặc fetch API
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/users/"; // Thay đổi URL này

const getCurrentAddress = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );

            const address = response.data.address;
            const ward = address.village || address.suburb || "";
            const district = address.county || "";
            const province = address.state || address.city || "";
            const fullAddress = `${ward}, ${district}, ${province}`.trim();
            resolve(fullAddress || "Không xác định");
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Trình duyệt không hỗ trợ Geolocation"));
    }
  });
};

const register = async (name, email, password, confirmPassword) => {
  try {
    const address = await getCurrentAddress();
    const response = await axios.post(API_URL + "register", {
      name,
      email,
      password,
      confirmPassword,
      address, // Thêm address vào body
    });

    return {
      success: true,
      message: "Đăng kí thành công!",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!",
    };
  }
};

const login = async (email, password) => {
  const response = await axios.post(API_URL + "login", {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data.token)); // Lưu thông tin người dùng vào localStorage
  }
  return response.data;
};

const logout = async () => {
  const token = localStorage.getItem("user");
  if (token) {
    try {
      await axios.post(API_URL + "logout", {}, { headers: authHeader() });
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("user");
  if (!token) {
    console.log("Không tìm thấy token trong localStorage");
    return null; // Trả về null nếu không có token
  }
    try {
      const response = await axios.get(API_URL + "me", {
        headers: authHeader(),
      });
      // console.log("Dữ liệu từ API /me:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi trong getCurrentUser:", error);
      throw error;
    }
  // }
};

const getAvatar = async () => {
  const token = localStorage.getItem("user");
  if (token) {
    try {
      const response = await axios.get(API_URL + "profile/image", {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi trong getAvatar:", error);
      throw error;
    }
  }
};

const sendEmaiResetPass = (email) => {
  return axios.post(API_URL + "forgot-password", {
    email,
  });
};

const uploadAvatar = (formData) => {
  return axios.put(API_URL + "upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader(), // Gộp thêm các header khác nếu cần
    },
  });
};

const resetPassword = async (token, formData) => {
  try {
    const response = await axios.put(
      API_URL + "reset-password/" + token,
      formData
    );

    return { success: true, message: "Thay đổi mật khẩu thành công!" };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error connecting to the server!",
    };
  }
};

const changePassword = async (formData) => {
  try {
    const response = await axios.put(API_URL + "change-password", formData, {
      headers: authHeader(),
    });
    return { success: true, message: "Thay đổi mật khẩu thành công!" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!",
    };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAvatar,
  sendEmaiResetPass,
  uploadAvatar,
  resetPassword,
  changePassword,
};

export default authService;
