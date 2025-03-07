import axios from "axios";

const API_BASE_URL = "https://provinces.open-api.vn/api";

export const getProvinces = async () => {
  const response = await axios.get(`${API_BASE_URL}/p/`);
  return response.data;
};

export const getDistricts = async (provinceCode) => {
  const response = await axios.get(
    `${API_BASE_URL}/d/search/?p=${provinceCode}`
  );
  return response.data;
};

export const getWards = async (districtCode) => {
  const response = await axios.get(
    `${API_BASE_URL}/w/search/?d=${districtCode}`
  );
  return response.data;
};
