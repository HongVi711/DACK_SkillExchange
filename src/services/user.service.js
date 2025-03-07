// src/services/user.service.js
import axios from "axios";
import authHeader from "./auth-header"; //Để gửi token

const API_URL = "http://localhost:5008/api/users/"; //Thay đổi URL này
const auth_Header = authHeader();

const updateUser = (formData) => {
  console.log("Data: ", formData);
  return axios.put(API_URL + "update-profile", formData, {
    headers: auth_Header,
  });
};

const updateUserSkills = async (data) => {
  return axios.put(API_URL + "add-skill", data, {
    headers: auth_Header,
  });
};

const searchUser = async (params) => {
  try {
    const response = await axios.get(API_URL + "search-user", {
      headers: auth_Header,
      params, // Truyền params dưới dạng query string
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const getAvatarUser = async (userId) => {
  const response = await axios.get(API_URL + "profile/image/" + userId, {
    headers: auth_Header,
  });
  return response.data;
};

const userService = {
  updateUser,
  updateUserSkills,
  searchUser,
  getAvatarUser,
};

export default userService;
