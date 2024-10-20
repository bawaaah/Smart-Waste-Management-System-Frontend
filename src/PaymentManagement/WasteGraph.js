// WasteGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const WasteGraph = () => {
  const wasteData = [150, 200, 120, 180, 250, 220];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Waste in KG',
        data: wasteData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensure the aspect ratio is maintained
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Waste (KG)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5" style={{ height: '300px' }}>
      <h2 className="text-xl font-semibold mb-4">Waste Details of Last 6 Months</h2>
      <Line data={data} options={options} height={300} />
    </div>
  );
};

export default WasteGraph;
