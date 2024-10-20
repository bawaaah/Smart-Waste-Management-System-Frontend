// src/api/malfunctionReport.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchReports = async (userId) => {
    const response = await axios.get(`${API_URL}/malfunctionReport/${userId}`);
    return response.data;
};

export const submitReport = async (deviceId, message, userId) => {
    const response = await axios.post(`${API_URL}/device/report-malfunction`, { deviceId, message, userId });
    return response.data;
};

export const updateReport = async (reportId, message) => {
    await axios.put(`${API_URL}/malfunctionReport/update/${reportId}`, { message });
};

export const deleteReport = async (reportId, deviceId) => {
    await axios.delete(`${API_URL}/malfunctionReport/delete`, {
        data: { reportId, deviceId },
    });
};

// Check if device exists
export const checkDeviceExists = async (deviceId) => {
    const response = await axios.get(`${API_URL}/device/device/${deviceId}`);
    return response.data.exists;
};
