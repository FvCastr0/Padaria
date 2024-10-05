import axios from "axios";

const http = axios.create({
    baseURL: 'https://padaria-server.vercel.app',
    method: 'GET',
    headers: {
        'Content-type': 'application/json'
    },
});

export default http;