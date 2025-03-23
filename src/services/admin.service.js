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

const lockUser = async (id, newLockStatus) => {
  try {
    const response = await axios.put(
      API_URL + "lock/" + id,
      { lock: newLockStatus },
      { headers: authHeader() }
    );
    return { status: true, message: `Đã khoá tài khoản người dùng!` };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const changeRole = async (id, currentRole) => {
  try {
    const response = await axios.put(
      API_URL + "change-role/" + id,
      { role: currentRole },
      { headers: authHeader() }
    );
    return { status: true, message: `Đã set role ${currentRole} cho account!` };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const getConnectionReports = async () => {
  try {
    const response = await axios.get(API_URL + "connection-report", {
      headers: authHeader()
    });

    return response?.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const adminService = {
  getAllUsers,
  deleteUser,
  lockUser,
  changeRole,
  getConnectionReports
};

export default adminService;
