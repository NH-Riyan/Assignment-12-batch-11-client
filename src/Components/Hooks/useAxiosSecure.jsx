import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
const axiosSecure = axios.create({
  baseURL: `https://a12b11-server.vercel.app`,
});

const useAxiosSecure = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      const token = await user.getIdToken(); 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  axiosSecure.interceptors.response.use(res => {
    return res;
  }, error => {
    const status = error.status;
    if (status === 403) {
      navigate('/forbidden');
    }
    else if (status === 401) {
      logOut()
        .then(() => {
          navigate('/login')
        })
        .catch(() => { })
    }

    return Promise.reject(error);
  })

  return axiosSecure;
};

export default useAxiosSecure;
