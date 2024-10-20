// src/api/__tests__/malfunctionReport.test.js

import axios from 'axios';
import {
    fetchReports,
    submitReport,
    updateReport,
    deleteReport,
    checkDeviceExists
} from './malfunctionReport';

describe('Malfunction Report API', () => {
    const userId = 'testUserId';
    const deviceId = 'testDeviceId';
    const reportId = 'testReportId';
    const message = 'Test message';

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mock calls after each test
    });

    test('fetchReports should return reports data', async () => {
        const reportsData = [{ _id: '1', message: 'Issue 1' }, { _id: '2', message: 'Issue 2' }];
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: reportsData });

        const result = await fetchReports(userId);
        expect(result).toEqual(reportsData);
        expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/malfunctionReport/${userId}`);
    });

    test('submitReport should return success message', async () => {
        const responseData = { message: 'Report submitted successfully.' };
        jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: responseData });

        const result = await submitReport(deviceId, message, userId);
        expect(result).toEqual(responseData);
        expect(axios.post).toHaveBeenCalledWith(`http://localhost:3000/api/device/report-malfunction`, { deviceId, message, userId });
    });

    test('updateReport should send a PUT request', async () => {
        jest.spyOn(axios, 'put').mockResolvedValueOnce({});

        await updateReport(reportId, message);
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:3000/api/malfunctionReport/update/${reportId}`, { message });
    });

    test('deleteReport should send a DELETE request', async () => {
        jest.spyOn(axios, 'delete').mockResolvedValueOnce({});

        await deleteReport(reportId, deviceId);
        expect(axios.delete).toHaveBeenCalledWith(`http://localhost:3000/api/malfunctionReport/delete`, {
            data: { reportId, deviceId },
        });
    });

    test('checkDeviceExists should return true if device exists', async () => {
        const responseData = { exists: true };
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseData });

        const result = await checkDeviceExists(deviceId);
        expect(result).toEqual(true);
        expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/device/device/${deviceId}`);
    });

    test('checkDeviceExists should return false if device does not exist', async () => {
        const responseData = { exists: false };
        jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseData });

        const result = await checkDeviceExists(deviceId);
        expect(result).toEqual(false);
        expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/api/device/device/${deviceId}`);
    });
});
