import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://a12b11-server.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;