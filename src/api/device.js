// src/api/device.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const addDevice = async (deviceData) => {
    const response = await axios.post(`${API_URL}/device/add`, deviceData);
    return response.data; // This should include the QR code if successful
};
