import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportMalfunction = ({ userId }) => {
    const [deviceId, setDeviceId] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingReportId, setEditingReportId] = useState(null); // Track which report is being edited

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/malfunctionReport/${userId}`);
                setReports(response.data);
            } catch (err) {
                setError('Error fetching reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [userId]); // Add userId as a dependency

    if (loading) return <p>Loading reports...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (!message) {
            setError('Please fill in the message field.');
            return;
        }

        try {
            // Check if the device ID is available in the system
            const checkDeviceResponse = await axios.get(`http://localhost:3000/api/device/device/${deviceId}`);

            if (checkDeviceResponse.data && checkDeviceResponse.data.exists) {
                if (editingReportId) {
                    // If editing, update the malfunction report
                    await axios.put(`http://localhost:3000/api/malfunctionReport/update/${editingReportId}`, { message });
                    setStatus('Report updated successfully.');
                } else {
                    // Submit the new malfunction report
                    const response = await axios.post('http://localhost:3000/api/device/report-malfunction', { deviceId, message, userId });
                    setStatus(response.data.message);
                }

                // Reset form fields
                setDeviceId('');
                setMessage('');
                setEditingReportId(null); // Reset editing state
            } else {
                setError('Device ID not found.');
            }
        } catch (err) {
            setError('Device ID not found.');
        }
    };

    // Function to handle deleting a report
    const handleDelete = async (reportId) => {
        setError('');
        try {
            // Get the device ID from the report
            const report = reports.find((r) => r._id === reportId);
            if (report) {
                await axios.delete('http://localhost:3000/api/malfunctionReport/delete', {
                    data: { reportId, deviceId: report.deviceId },
                });
                setReports((prevReports) => prevReports.filter((r) => r._id !== reportId));
                setStatus('Report deleted and device status updated to active.');
            }
        } catch (err) {
            setError('Error deleting report.');
        }
    };

    // Function to handle editing a report
    const handleEdit = (report) => {
        setDeviceId(report.deviceId); // Set deviceId from the report
        setMessage(report.message);
        setEditingReportId(report._id); // Set the ID of the report being edited
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Report a Malfunctioning Device</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {status && <p className="text-green-500 text-center">{status}</p>}
            
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="deviceId">
                        Device ID
                    </label>
                    <input
                        type="text"
                        id="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)} // Allow editing of deviceId
                        className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter device ID"
                        readOnly={editingReportId !== null} // Make read-only if editing
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

            <div className="mt-6">
                {reports.length === 0 ? (
                    <p className="text-center text-gray-500">No reports submitted yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {reports.map((report) => (
                            <li key={report._id} className="border border-gray-300 bg-gray-50 p-4 rounded shadow-sm">
                                <h2 className="text-lg font-semibold">Device ID: {report.deviceId}</h2>
                                <p className="text-sm">Description: {report.message}</p>
                                <p className="text-xs text-gray-500">Reported on: {new Date(report.dateReported).toLocaleString()}</p>

                                {/* Show reply if it exists */}
                                {report.reply && (
                                    <div className="mt-2 p-2 bg-gray-100 border border-gray-300 rounded">
                                        <strong>Reply: </strong>
                                        <p>{report.reply}</p>
                                    </div>
                                )}
                                {/* Disable edit and delete buttons if a reply exists */}
                                {!report.reply && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(report)} // Trigger editing mode
                                            className="mt-2 text-blue-500 hover:underline pr-5"
                                        >
                                            Edit Report
                                        </button>
                                        <button
                                            onClick={() => handleDelete(report._id)}
                                            className="mt-2 text-red-500 hover:underline"
                                        >
                                            Delete Report
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ReportMalfunction;
