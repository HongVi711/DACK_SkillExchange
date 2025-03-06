// src/services/auth.service.js
import axios from "axios"; // Hoặc fetch API
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/users/"; // Thay đổi URL này
const header = authHeader();

const register = (name, email, password, confirmPassword) => {
  return axios.post(API_URL + "register", {
    name,
    email,
    password,
    confirmPassword,
  });
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
      await axios.post(API_URL + "logout", {}, { headers: header });
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
  if (token) {
    try {
      const response = await axios.get(API_URL + "me", { headers: header });
      return response.data;
    } catch (error) {
      console.error("Lỗi trong getCurrentUser:", error);
      throw error;
    }
  }
};

const getAvatar = async () => {
  const token = localStorage.getItem("user");
  if (token) {
    try {
      const response = await axios.get(API_URL + "profile/image", {
        headers: header,
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
      ...header, // Gộp thêm các header khác nếu cần
    },
  });
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAvatar,
  sendEmaiResetPass,
  uploadAvatar,
};

export default authService;
