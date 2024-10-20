import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Home/Header'; // Import Header
import createChartData from './createChartData'; // Import the factory function

// Register chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteMonitoringDashboard = ({ userId }) => {
    const [totalDevices, setTotalDevices] = useState(0);
    const [activeDevices, setActiveDevices] = useState(0);
    const [devicesNeedingAttention, setDevicesNeedingAttention] = useState(0);
    const [criticalWasteLevels, setCriticalWasteLevels] = useState(0);
    const [wasteRecords, setWasteRecords] = useState([]); // For recent activity
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Fetch devices data from the backend on component mount
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/device/${userId}`);
                const devices = response.data;
                
                // Calculate statistics
                setTotalDevices(devices.length);
                setActiveDevices(devices.filter(device => device.status === 'Active').length);
                setDevicesNeedingAttention(devices.filter(device => device.status !== 'Active').length);
                setCriticalWasteLevels(devices.filter(device => (device.spaceLeft / device.capacity) * 100 <= 30).length);
            } catch (err) {
                setError('Failed to fetch device data.');
            }
        };

        fetchDevices();
    }, []);

    // Fetch recent waste records and filter by the last 7 days
    useEffect(() => {
        const fetchWasteRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/waste/${userId}`);
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

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Waste Records by Device Type (Last 7 Days)',
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
        <div>
            <Header />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center pt-10">Waste Monitoring Dashboard</h1>

                {error && <p className="text-red-500">{error}</p>}

                {/* Display dashboard overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div 
                        className="dashboard-card bg-blue-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
                        onClick={() => navigate('/device-status')} // Navigate when clicked
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
                        onClick={() => navigate('/ReportMalfunction')} // Navigate when clicked
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

                {/* Bar chart for waste records */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Waste Records by Device Type (Last 7 Days)</h2>
                    <div className="w-full h-96">
                        <Bar data={createChartData(wasteRecords)} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WasteMonitoringDashboard;
