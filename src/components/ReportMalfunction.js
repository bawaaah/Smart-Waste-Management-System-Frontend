// src/components/ReportMalfunction/ReportMalfunction.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Home/Header';

const API_URL = 'http://localhost:3000/api';

const ReportMalfunction = ({ userId }) => {
    // State variables
    const [deviceId, setDeviceId] = useState('');
    const [message, setMessage] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [editingReportId, setEditingReportId] = useState(null);

    // Fetch reports when the component mounts
    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                const response = await axios.get(`${API_URL}/malfunctionReport/${userId}`);
                setReports(response.data);
            } catch (err) {
                setError('Error fetching reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, [userId]);

    // Handle report submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (!message) {
            setError('Please fill in the message field.');
            return;
        }

        try {
            const deviceExists = await checkDeviceExists(deviceId);
            if (deviceExists) {
                if (editingReportId) {
                    await updateReport(editingReportId, message);
                    setStatus('Report updated successfully.');
                } else {
                    const response = await submitReport(deviceId, message, userId);
                    setStatus(response.message);
                }
                resetForm();
            } else {
                setError('Device ID not found.');
            }
        } catch (err) {
            setError('Error submitting report.');
        }
    };

    // Handle report deletion
    const handleDelete = async (reportId) => {
        setError('');
        try {
            const report = reports.find((r) => r._id === reportId);
            if (report) {
                await deleteReport(reportId, report.deviceId);
                setReports((prevReports) => prevReports.filter((r) => r._id !== reportId));
                setStatus('Report deleted and device status updated to active.');
            }
        } catch (err) {
            setError('Error deleting report.');
        }
    };

    // Handle report editing
    const handleEdit = (report) => {
        setDeviceId(report.deviceId);
        setMessage(report.message);
        setEditingReportId(report._id);
    };

    // Reset the form fields
    const resetForm = () => {
        setDeviceId('');
        setMessage('');
        setEditingReportId(null);
    };

    // Function to check if a device exists
    const checkDeviceExists = async (deviceId) => {
        const response = await axios.get(`${API_URL}/device/device/${deviceId}`);
        return response.data.exists;
    };

    // Function to submit a report
    const submitReport = async (deviceId, message, userId) => {
        const response = await axios.post(`${API_URL}/device/report-malfunction`, { deviceId, message, userId });
        return response.data;
    };

    // Function to update a report
    const updateReport = async (reportId, message) => {
        await axios.put(`${API_URL}/malfunctionReport/update/${reportId}`, { message });
    };

    // Function to delete a report
    const deleteReport = async (reportId, deviceId) => {
        await axios.delete(`${API_URL}/malfunctionReport/delete`, {
            data: { reportId, deviceId },
        });
    };

    // Loading state
    if (loading) return <p>Loading reports...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold text-center mb-6">Report Malfunction</h1>

                {/* Report Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="deviceId">
                            Device ID
                        </label>
                        <input
                            type="text"
                            id="deviceId"
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter device ID"
                            readOnly={editingReportId !== null}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" htmlFor="message">
                            Description of Malfunction
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the issue"
                            rows="4"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors w-full"
                    >
                        {editingReportId ? 'Update Report' : 'Submit Report'}
                    </button>
                </form>

                {/* Report List */}
                <ul className="space-y-4 mt-6">
                    {reports.length === 0 ? (
                        <p className="text-center text-gray-500">No reports submitted yet.</p>
                    ) : (
                        reports.map((report) => (
                            <li key={report._id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                                <h2 className="text-lg font-semibold">Device ID: {report.deviceId}</h2>
                                <p className="text-sm">Description: {report.message}</p>
                                <p className="text-xs text-gray-500">Reported on: {new Date(report.dateReported).toLocaleString()}</p>
                                {report.reply && (
                                    <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded">
                                        <strong>Reply: </strong>
                                        <p>{report.reply}</p>
                                    </div>
                                )}
                                {!report.reply && (
                                    <>
                                        <button onClick={() => handleEdit(report)} className="mt-2 text-blue-500 hover:underline pr-5">
                                            Edit Report
                                        </button>
                                        <button onClick={() => handleDelete(report._id)} className="mt-2 text-red-500 hover:underline">
                                            Delete Report
                                        </button>
                                    </>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                {/* Status Message */}
                {status && <p className="text-green-500 text-center">{status}</p>}
            </div>
        </div>
    );
};

export default ReportMalfunction;
