// createChartData.js

const createChartData = (wasteRecords) => {
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
    const degradableData = labels.map(label => groupedData[label].Degradable);
    const paperData = labels.map(label => groupedData[label].Paper);
    const glassData = labels.map(label => groupedData[label].Glass);

    return {
        labels,
        datasets: [
            {
                label: 'Plastic',
                data: plasticData,
                backgroundColor: 'rgba(252, 211, 77, 0.5)', // Orange based color
            },
            {
                label: 'Degradable',
                data: degradableData,
                backgroundColor: 'rgba(134, 239, 172, 0.5)', // Green based color
            },
            {
                label: 'Paper',
                data: paperData,
                backgroundColor: 'rgba(147, 197, 253, 0.5)', // Blue based color
            },
            {
                label: 'Glass',
                data: glassData,
                backgroundColor: 'rgba(248, 113, 113, 0.5)', // Red based color
            },
        ],
    };
};

export default createChartData;
