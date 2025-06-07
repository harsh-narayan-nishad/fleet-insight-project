
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PurchaseMixChart = () => {
  const data = {
    labels: ['Small Vehicles', 'Large Vehicles', 'Electric Vehicles'],
    datasets: [
      {
        data: [520, 207, 120],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          'rgba(147, 51, 234, 0.9)',
          'rgba(34, 197, 94, 0.9)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PurchaseMixChart;
