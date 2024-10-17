import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Modal Component
const StatusModal = ({ isOpen, onClose, onSubmit }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleSubmit = () => {
        onSubmit(selectedStatus);
        onClose(); // Close the modal after submission
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Select Device Status</h2>
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setSelectedStatus('Active')}
                            className={`p-2 rounded border ${selectedStatus === 'Active' ? 'bg-blue-200' : ''}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setSelectedStatus('Inactive')}
                            className={`p-2 rounded border ${selectedStatus === 'Inactive' ? 'bg-blue-200' : ''}`}
                        >
                            Inactive
                        </button>
                        <button
                            onClick={() => setSelectedStatus('Malfunction')}
                            className={`p-2 rounded border ${selectedStatus === 'Malfunction' ? 'bg-blue-200' : ''}`}
                        >
                            Malfunction
                        </button>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

const AdminReportMalfunction = ({ userId }) => {
    const [deviceId, setDeviceId] = useState('');
    const [message, setMessage] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reply, setReply] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/malfunctionReport/`);
                setReports(response.data);
            } catch (err) {
                setError('Error fetching reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <p>Loading reports...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // Function to handle form submission for a new malfunction report
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (!deviceId || !message) {
            setError('Please fill in both fields.');
            return;
        }

        try {
            // Check if the device ID is available in the system
            const checkDeviceResponse = await axios.get(`http://localhost:3000/api/device/device/${deviceId}`);

            if (checkDeviceResponse.data && checkDeviceResponse.data.exists) {
                // Submit the malfunction report
                const response = await axios.post('http://localhost:3000/api/device/report-malfunction', { deviceId, message, userId });
                setStatus(response.data.message);
                setDeviceId('');
                setMessage('');
            } else {
                setError('Device ID not found.');
            }
        } catch (err) {
            setError('Device ID not found.');
        }
    };

    // Function to handle replying to a report
    const handleReplyClick = (reportId) => {
        setSelectedReportId(reportId);
        setIsModalOpen(true);
    };

    const handleReplySubmit = async (status) => {
        setError('');
        setStatus('');

        if (!reply) {
            setError('Please provide a reply.');
            return;
        }

        try {
            // Update the device status and save the reply
            const report = reports.find((r) => r._id === selectedReportId);
            if (report) {
                await axios.put(`http://localhost:3000/api/malfunctionReport/replyToMalfunctionReport`, {
                    reportId: selectedReportId,
                    reply,
                    deviceId: report.deviceId,
                });
                
                // Update the device status
                await axios.put(`http://localhost:3000/api/device/updateDeviceStatusReport`, {
                    deviceId: report.deviceId,
                    status,
                });

                // Update local reports state with the new reply
                setReports((prevReports) =>
                    prevReports.map((r) => (r._id === selectedReportId ? { ...r, reply } : r))
                );

                setStatus('Reply submitted and device status updated.');
                setReply(''); // Clear the reply field
            }
        } catch (err) {
            setError('Error replying to report.');
        } finally {
            setIsModalOpen(false);
            setSelectedReportId(null);
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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Reported Malfunctioning Device</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {status && <p className="text-green-500 text-center">{status}</p>}
            
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

                                <div className="mt-2">
                                    <textarea
                                        onChange={(e) => setReply(e.target.value)} // Update reply state
                                        className="border p-2 w-full rounded"
                                        placeholder="Type your reply here..."
                                    />
                                    <button
                                        onClick={() => handleReplyClick(report._id)} // Open modal to select status
                                        className="mt-2 text-blue-500 hover:underline p-5"
                                    >
                                        Reply
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report._id)}
                                        className="mt-2 text-red-500 hover:underline "
                                    >
                                        Delete Report
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal for selecting device status */}
            <StatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleReplySubmit}
            />
        </div>
    );
};

export default AdminReportMalfunction;
