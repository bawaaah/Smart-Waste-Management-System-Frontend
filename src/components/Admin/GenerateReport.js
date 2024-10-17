import React, { useState } from 'react';
import axios from 'axios';

const GenerateReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deviceType, setDeviceType] = useState('All');
    const [reportFormat, setReportFormat] = useState('PDF');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null); // State for PDF preview URL
    
    // Handle form submission to generate the report
    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPdfUrl(null); // Clear previous PDF URL

        try {
            // Send request to the server to generate the report
            const response = await axios.post('http://localhost:3000/api/report/generate', {
                startDate,
                endDate,
                deviceType,
                reportFormat,
            }, { responseType: 'blob' });

            if (reportFormat === 'PDF') {
                // Create a preview URL for the PDF
                const fileUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                setPdfUrl(fileUrl); // Set the preview URL
            } else if (reportFormat === 'CSV') {
                const blob = new Blob([response.data], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'report.csv';
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to generate report.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Generate Waste Report</h1>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleGenerateReport} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                        Start Date
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                        End Date
                    </label>
                    <input
                        id="endDate"
                        type="date"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deviceType">
                        Device Type
                    </label>
                    <select
                        id="deviceType"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Degradable">Degradable</option>
                        <option value="Paper">Paper</option>
                        <option value="Glass">Glass</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportFormat">
                        Report Format
                    </label>
                    <select
                        id="reportFormat"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={reportFormat}
                        onChange={(e) => setReportFormat(e.target.value)}
                    >
                        <option value="PDF">PDF</option>
                        <option value="CSV">CSV</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </form>

            {pdfUrl && (
                <div>
                    <h2 className="text-xl font-bold mt-6">PDF Preview</h2>
                    <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview" />
                    <a href={pdfUrl} download="report.pdf" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 rounded inline-block">
                        Download PDF
                    </a>
                </div>
            )}
        </div>
    );
};

export default GenerateReport;
