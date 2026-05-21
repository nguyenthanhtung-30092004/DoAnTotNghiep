import axios from "axios";

const ADDRESS_API = "https://provinces.open-api.vn/api";

const getProvinces = () => {
  return axios.get(`${ADDRESS_API}/p/`);
};

const getDistricts = (provinceCode) => {
  return axios.get(`${ADDRESS_API}/p/${provinceCode}`, {
    params: { depth: 2 },
  });
};

const getWards = (districtCode) => {
  return axios.get(`${ADDRESS_API}/d/${districtCode}`, {
    params: { depth: 2 },
  });
};

export default {
  getProvinces,
  getDistricts,
  getWards,
};
