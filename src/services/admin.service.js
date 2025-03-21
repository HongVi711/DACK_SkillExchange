import axios from "axios"; // Hoặc fetch API
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/admins/"; // Thay đổi URL này

const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader()
    });

    return response?.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(API_URL + id, {
      headers: authHeader()
    });

    return { status: true, message: "Xoá user thành công!" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const adminService = {
  getAllUsers,
  deleteUser
};

export default adminService;
