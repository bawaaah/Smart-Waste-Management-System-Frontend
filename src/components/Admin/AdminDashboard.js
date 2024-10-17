import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDevices, setTotalDevices] = useState(0);
    const [activeDevices, setActiveDevices] = useState(0);
    const [devicesNeedingAttention, setDevicesNeedingAttention] = useState(0);
    const [criticalWasteLevels, setCriticalWasteLevels] = useState(0);
    const [wasteRecords, setWasteRecords] = useState([]); // For recent activity
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Fetch users and devices data from the backend on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Fetch total users
                const userResponse = await axios.get('http://localhost:3000/api/auth/totalUsers'); // Adjust the URL based on your API endpoint
                setTotalUsers(userResponse.data.length);

                // Fetch devices
                const deviceResponse = await axios.get('http://localhost:3000/api/device'); // Adjust the URL based on your API endpoint
                const devices = deviceResponse.data;

                // Calculate statistics
                setTotalDevices(devices.length);
                setActiveDevices(devices.filter(device => device.status === 'Active').length);
                setDevicesNeedingAttention(devices.filter(device => device.status !== 'Active').length);
                setCriticalWasteLevels(devices.filter(device => (device.spaceLeft / device.capacity) * 100 <= 30).length); // e.g., less than 30% space left
            } catch (err) {
                setError('Failed to fetch admin data.');
            }
        };

        fetchAdminData();
    }, []);

    // Fetch recent waste records (for the last 7 days)
    useEffect(() => {
        const fetchWasteRecords = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/waste'); // Adjust the URL based on your API endpoint
                const records = response.data;

                // Filter records for the last 7 days
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const recentRecords = records.filter(record => {
                    const recordDate = new Date(record.date);
                    return recordDate >= sevenDaysAgo;
                });

                setWasteRecords(recentRecords);
            } catch (err) {
                setError('Failed to fetch waste records.');
            }
        };

        fetchWasteRecords();
    }, []);

    // Helper function to prepare chart data for each waste type
    const prepareChartDataForType = (type) => {
        const groupedData = {};

        wasteRecords.forEach(record => {
            const date = new Date(record.date).toLocaleDateString();
            if (!groupedData[date]) {
                groupedData[date] = 0;
            }
            if (record.deviceType === type) {
                groupedData[date] += record.weight;
            }
        });

        const labels = Object.keys(groupedData);
        const data = labels.map(label => groupedData[label]);

        return {
            labels,
            datasets: [
                {
                    label: `${type} Waste`,
                    data: data,
                    backgroundColor: {
                        Plastic: 'rgba(252, 211, 77, 0.5)', // Orange based color
                        Degradable: 'rgba(134, 239, 172, 0.5)', // Green based color
                        Paper: 'rgba(147, 197, 253, 0.5)', // Blue based color
                        Glass: 'rgba(248, 113, 113, 0.5)' // Red based color
                    }[type],
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Waste Records (Last 7 Days)',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Weight (kg)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {error && <p className="text-red-500">{error}</p>}

            {/* Display dashboard overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div 
                    className="dashboard-card bg-blue-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => navigate('/AdminUserDashboard')} // Navigate when clicked
                >
                    <h2 className="text-xl font-bold">Total Users</h2>
                    <p className="text-3xl mt-2">{totalUsers}</p>
                </div>

                <div 
                    className="dashboard-card bg-blue-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
                    onClick={() => navigate('/AdminDeviceStatus')} // Navigate when clicked
                >
                    <h2 className="text-xl font-bold">Total Devices</h2>
                    <p className="text-3xl mt-2">{totalDevices}</p>
                </div>

                <div className="dashboard-card bg-green-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Active Devices</h2>
                    <p className="text-3xl mt-2">{activeDevices}</p>
                </div>

                <div 
                    className="dashboard-card bg-red-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-600 transition-colors"
                    onClick={() => navigate('/AdminReportMalfunction')} // Navigate when clicked
                >
                    <h2 className="text-xl font-bold">Malfunctioning Devices</h2>
                    <p className="text-3xl mt-2">{devicesNeedingAttention}</p>
                </div>

                <div 
                    className="dashboard-card bg-yellow-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-yellow-600 transition-colors"
                    onClick={() => navigate('/critical-devices')} // Navigate when clicked
                >
                    <h2 className="text-xl font-bold">Waste Levels Critical</h2>
                    <p className="text-3xl mt-2">{criticalWasteLevels}</p>
                </div>
            </div>

            {/* Bar charts for each waste type */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                

                {/* Plastic Waste Chart */}
                <div className="w-full h-96 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Plastic Waste (Last 7 Days)</h3>
                    <Bar data={prepareChartDataForType('Plastic')} options={chartOptions} />
                </div>

                {/* Degradable Waste Chart */}
                <div className="w-full h-96 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Degradable Waste (Last 7 Days)</h3>
                    <Bar data={prepareChartDataForType('Degradable')} options={chartOptions} />
                </div>

                {/* Paper Waste Chart */}
                <div className="w-full h-96 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Paper Waste (Last 7 Days)</h3>
                    <Bar data={prepareChartDataForType('Paper')} options={chartOptions} />
                </div>

                {/* Glass Waste Chart */}
                <div className="w-full h-96 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Glass Waste (Last 7 Days)</h3>
                    <Bar data={prepareChartDataForType('Glass')} options={chartOptions} />
                </div>
            </div>

            {/* Button to generate report */}
            <div className="mt-8">
                <button
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={() => navigate('/GenerateReport')} // Navigate to report generation
                >
                    Generate Report
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
