// src/api/device.test.js

import axios from 'axios';
import { addDevice } from './device';

jest.mock('axios');

describe('addDevice', () => {
    it('should send a POST request and return data', async () => {
        const deviceData = {
            status: 'Active',
            spaceLeft: 50,
            deviceType: 'Plastic',
            capacity: 100,
            userId: 'user123'
        };

        const mockResponse = {
            data: {
                qrCode: 'http://example.com/qrcode.png'
            }
        };

        axios.post.mockResolvedValue(mockResponse);

        const result = await addDevice(deviceData);

        expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/device/add', deviceData);
        expect(result).toEqual(mockResponse.data); // Validate the returned data
    });

    it('should handle errors correctly', async () => {
        const deviceData = {
            status: 'Active',
            spaceLeft: 50,
            deviceType: 'Plastic',
            capacity: 100,
            userId: 'user123'
        };

        const errorMessage = 'Failed to add device';
        axios.post.mockRejectedValue(new Error(errorMessage));

        await expect(addDevice(deviceData)).rejects.toThrow(errorMessage);
    });
});
