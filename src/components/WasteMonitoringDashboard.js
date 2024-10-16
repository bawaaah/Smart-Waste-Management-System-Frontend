import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
                const response = await axios.get(`http://localhost:3000/api/device/${userId}`); // Adjust the URL based on your API endpoint
                const devices = response.data;
                
                // Calculate statistics
                setTotalDevices(devices.length);
                setActiveDevices(devices.filter(device => device.status === 'Active').length);
                setDevicesNeedingAttention(devices.filter(device => device.status !== 'Active').length);
                setCriticalWasteLevels(devices.filter(device => (device.spaceLeft / device.capacity) * 100 <= 30).length); // e.g., less than 30% space left
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
                const response = await axios.get(`http://localhost:3000/api/waste/${userId}`); // Adjust the URL based on your API endpoint
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

    // Prepare data for the chart
    const prepareChartData = () => {
        // Group waste records by date and deviceType
        const groupedData = {};
        wasteRecords.forEach(record => {
            const date = new Date(record.date).toLocaleDateString();
            if (!groupedData[date]) {
                groupedData[date] = { Plastic: 0, Degradable: 0, Paper: 0, Glass: 0 };
            }
            groupedData[date][record.deviceType] += record.weight;
        });

        // Extract labels and dataset for the chart
        const labels = Object.keys(groupedData);
        const plasticData = labels.map(label => groupedData[label].Plastic);
        const foodData = labels.map(label => groupedData[label].Degradable);
        const paperData = labels.map(label => groupedData[label].Paper);
        const glassData = labels.map(label => groupedData[label].Glass);

        return {
            labels,
            datasets: [
                {
                    label: 'Plastic',
                    data: plasticData,
                    backgroundColor: 'rgba(252, 211, 77, 0.5)', // Orange based color (bg-orange-300)
                },
                {
                    label: 'Degradable',
                    data: foodData,
                    backgroundColor: 'rgba(134, 239, 172, 0.5)', // Green based color (bg-green-300)
                },
                {
                    label: 'Paper',
                    data: paperData,
                    backgroundColor: 'rgba(147, 197, 253, 0.5)', // Blue based color (bg-blue-300)
                },
                {
                    label: 'Glass',
                    data: glassData,
                    backgroundColor: 'rgba(248, 113, 113, 0.5)', // Red based color (bg-red-300)
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
        <div className="container mx-auto p-4">
             <h1 className="text-3xl font-bold mb-6">{ userId }</h1>

            <h1 className="text-3xl font-bold mb-6">Waste Monitoring Dashboard</h1>

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
                    <Bar data={prepareChartData()} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default WasteMonitoringDashboard;
