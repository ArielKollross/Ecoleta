import axios from 'axios';

const localhost = '192.168.15.13';
const port = '3333';

const api = axios.create({
    baseURL: `http://${localhost}:${port}`
});

export default api;