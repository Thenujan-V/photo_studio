import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
    const calculatePercentages = (values) => {
        const total = values.reduce((acc, val) => acc + val, 0);
        return values.map(value => ((value / total) * 100).toFixed(2));
    };

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'User Data',
                data: data.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: true,
        responsive: true,
        width: 400,
        height: 400,
        aspectRatio: 1,
    };

    const percentages = calculatePercentages(data.values);

    const chartDataWithPercentages = {
        ...chartData,
        labels: data.labels.map((label, index) => `${label}: ${data.values[index]} (${percentages[index]}%)`)
    };

    return (
        <div style={{ width: '25vw', marginBottom: "1%", padding: "2vw", display: 'flex', flexDirection: '', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut
                data={chartDataWithPercentages}
                options={options}
            />
        </div>
    );
};

export default PieChart;
