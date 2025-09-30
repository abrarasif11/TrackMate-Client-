import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://trackmate-server-neon.vercel.app`,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
