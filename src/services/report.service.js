import axios from "axios";
import authHeader from "./auth-header"; //Để gửi token

const API_URL = "http://localhost:5008/api/reports/"; //Thay đổi URL này

const getAllReports = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader()
    });

    return response?.data?.data;
  } catch (error) {
    throw error.response?.data || { message: "Đã xảy ra lỗi khi tìm kiếm" };
  }
};

const changeStatus = async (id, status) => {
  try {
    const response = await axios.put(
      API_URL + "change-status/" + id,
      { status: status },
      { headers: authHeader() }
    );
    return { status: true, message: `Cập nhật trang thái thành công!` };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const getWarningReport = async () => {
  try {
    const response = await axios.get(API_URL + "get-warning", {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const cancelReport = async (id) => {
  try {
    const response = await axios.delete(API_URL + id, {
      headers: authHeader()
    });
    return { status: true, message: `Huỷ thành công` };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};

const createReport = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: authHeader()
    });
    return response?.data?.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!"
    };
  }
};
const reportService = {
  getAllReports,
  changeStatus,
  getWarningReport,
  cancelReport,
  createReport
};

export default reportService;
