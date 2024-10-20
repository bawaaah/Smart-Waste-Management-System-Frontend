import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Generate report (PDF or CSV)
export const generateReport = async (startDate, endDate, deviceType, reportFormat) => {
    const response = await axios.post(`${API_URL}/report/generate`, {
        startDate,
        endDate,
        deviceType,
        reportFormat
    }, { responseType: 'blob' });

    return response.data;
};
