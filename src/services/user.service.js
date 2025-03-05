// src/services/user.service.js
import axios from "axios";
import authHeader from "./auth-header"; //Để gửi token

const API_URL = "http://localhost:5008/api/users/"; //Thay đổi URL này
const auth_Header = authHeader();

const updateUser = (formData) => {
  return axios.put(API_URL + "update-profile", formData, {
    headers: auth_Header,
  });
};

const updateUserSkills = async (data) => {
  console.log("Formdata: ", data);
  // Giả sử đây là API call
  return axios.put(API_URL + "add-skill", data, {
    headers: auth_Header,
  });
};
const userService = {
  updateUser,
  updateUserSkills,
};

export default userService;
