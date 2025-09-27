import axios from "axios";

const axiosObject = axios.create({
  baseURL: "http://localhost:4000/api", 
});


export default axiosObject;