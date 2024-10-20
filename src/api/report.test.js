import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { generateReport } from './report'; // adjust the import path based on your folder structure

// Mock Blob for Node.js environment
global.Blob = function (content, options) {
    return { content, options }; // Simple mock representation of Blob
};

describe('generateReport', () => {
    let mockAxios;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it('should generate a report and return a Blob for PDF format', async () => {
        // Mock the response for PDF
        const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
        mockAxios.onPost('http://localhost:3000/api/report/generate').reply(200, mockBlob);

        const startDate = '2023-01-01';
        const endDate = '2023-01-31';
        const deviceType = 'All';
        const reportFormat = 'PDF';

        const response = await generateReport(startDate, endDate, deviceType, reportFormat);

        expect(response).toBeInstanceOf(Object); // Since we're mocking Blob, check that it's an object
        expect(response.content).toEqual(['PDF content']);
        expect(response.options.type).toBe('application/pdf');
    });

    it('should generate a report and return a Blob for CSV format', async () => {
        // Mock the response for CSV
        const mockBlob = new Blob(['CSV content'], { type: 'text/csv' });
        mockAxios.onPost('http://localhost:3000/api/report/generate').reply(200, mockBlob);

        const startDate = '2023-01-01';
        const endDate = '2023-01-31';
        const deviceType = 'All';
        const reportFormat = 'CSV';

        const response = await generateReport(startDate, endDate, deviceType, reportFormat);

        expect(response).toBeInstanceOf(Object); // Check that it's an object
        expect(response.content).toEqual(['CSV content']);
        expect(response.options.type).toBe('text/csv');
    });

    it('should throw an error if the report generation fails', async () => {
        // Mock a failed response
        mockAxios.onPost('http://localhost:3000/api/report/generate').reply(500);

        const startDate = '2023-01-01';
        const endDate = '2023-01-31';
        const deviceType = 'All';
        const reportFormat = 'PDF';

        await expect(generateReport(startDate, endDate, deviceType, reportFormat)).rejects.toThrow();
    });
});
