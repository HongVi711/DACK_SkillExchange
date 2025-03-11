import axios from "axios"; // Hoặc fetch API
import authHeader from "./auth-header";

const API_URL = "http://localhost:5008/api/appointments/"; // Thay đổi URL này

const getAppointments = async () => {
  const response = await axios.get(API_URL, {
    headers: authHeader(),
  });
  return response.data;
};

const updateStatus = async (newStatus, id) => {
  try {
    console.log("status: ", newStatus);
    const response = await axios.put(
      API_URL + id,
      { status: newStatus },
      {
        headers: authHeader(),
      }
    );
    return { status: true, message: "Cập nhật trạng thái thành công" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi kết nối!",
    };
  }
};

const appointmentService = {
  getAppointments,
  updateStatus,
};

export default appointmentService;
