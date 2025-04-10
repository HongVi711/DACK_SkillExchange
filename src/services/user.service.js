// src/services/user.service.js
import axios from "axios";
import authHeader from "./auth-header";

const API_URL = `https://${window.location.hostname}:${
  import.meta.env.VITE_PORT
}/api/users/`;
const auth_Header = authHeader();

const updateUser = (formData) => {
  return axios.put(API_URL + "update-profile", formData, {
    headers: auth_Header
  });
};

const updateUserSkills = async (data) => {
  return axios.put(API_URL + "add-skill", data, {
    headers: auth_Header
  });
};

const searchUser = async (params) => {
  try {
    const response = await axios.get(API_URL + "search-user", {
      headers: auth_Header,
      params
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const searchUserInNetwork = async (params) => {
  try {
    const response = await axios.get(API_URL + "search-user-in-network", {
      headers: auth_Header,
      params
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const getAvatarUser = async (userId) => {
  const response = await axios.get(API_URL + "profile/image/" + userId, {
    headers: auth_Header
  });
  return response.data;
};

const getUserIDs = async () => {
  const response = await axios.get(API_URL + "getUserID", {
    headers: auth_Header
  });
  return response.data;
};

const getName = async (userId) => {
  const response = await axios.get(API_URL + "name/" + userId, {
    headers: auth_Header
  });
  return response.data;
};

const userService = {
  updateUser,
  updateUserSkills,
  searchUser,
  getAvatarUser,
  getUserIDs,
  searchUserInNetwork,
  getName
};

export default userService;
