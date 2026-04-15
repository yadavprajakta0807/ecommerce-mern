import axios from "axios";

const api = axios.create({
    baseURL : "https://ecommerce-mern-susr.onrender.com",
});

export default api ;