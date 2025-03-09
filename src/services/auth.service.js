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
  if (token) {
    try {
      const response = await axios.get(API_URL + "me", {
        headers: authHeader(),
      });
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

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAvatar,
  sendEmaiResetPass,
  uploadAvatar,
  resetPassword,
};

export default authService;
