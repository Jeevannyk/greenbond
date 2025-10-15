import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { ChartData } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartsProps {
  data: ChartData;
  type: 'bar' | 'line' | 'doughnut' | 'pie';
  height?: number;
  options?: Record<string, unknown>;
}

export default function Charts({ data, type, height = 300, options = {} }: ChartsProps) {
  const chartRef = useRef<ChartJS | null>(null);

  // Default options for different chart types
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: type === 'bar' || type === 'line' ? {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      },
    } : undefined,
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...(options.plugins as Record<string, unknown> || {}),
    },
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const renderChart = () => {
    const commonProps = {
      ref: chartRef,
      data,
      options: mergedOptions,
      height,
    };

    switch (type) {
      case 'bar':
        return <Bar {...commonProps} />;
      case 'line':
        return <Line {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      default:
        return <Bar {...commonProps} />;
    }
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      {renderChart()}
    </div>
  );
}

// Utility functions for creating chart data
export const createBarChartData = (
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>
): ChartData => ({
  labels,
  datasets: datasets.map(dataset => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || 'rgba(34, 197, 94, 0.8)',
    borderColor: dataset.borderColor || 'rgba(34, 197, 94, 1)',
    borderWidth: dataset.borderWidth || 1,
  })),
});

export const createLineChartData = (
  labels: string[],
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }>
): ChartData => ({
  labels,
  datasets: datasets.map(dataset => ({
    ...dataset,
    borderColor: dataset.borderColor || 'rgba(34, 197, 94, 1)',
    backgroundColor: dataset.backgroundColor || 'rgba(34, 197, 94, 0.1)',
    tension: dataset.tension || 0.4,
    fill: dataset.fill !== undefined ? dataset.fill : true,
  })),
});

export const createDoughnutChartData = (
  labels: string[],
  data: number[],
  backgroundColor?: string[]
): ChartData => ({
  labels,
  datasets: [
    {
      label: 'Distribution',
      data,
      backgroundColor: backgroundColor || [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
      ],
      borderWidth: 2,
      borderColor: 'white',
    },
  ],
});

export const createPieChartData = (
  labels: string[],
  data: number[],
  backgroundColor?: string[]
): ChartData => ({
  labels,
  datasets: [
    {
      label: 'Distribution',
      data,
      backgroundColor: backgroundColor || [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderWidth: 2,
      borderColor: 'white',
    },
  ],
});

// Impact metrics specific chart configurations
export const impactMetricsChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context: TooltipItem<'bar'>) {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          const unit = getUnitForMetric(context.label);
          return `${label}: ${value.toLocaleString()} ${unit}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: string | number) {
          return Number(value).toLocaleString();
        },
      },
    },
  },
};

export const portfolioChartOptions = {
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context: TooltipItem<'doughnut'>) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};

export const timelineChartOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Month',
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Progress (%)',
      },
      min: 0,
      max: 100,
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
};

// Helper function to get units for different metrics
function getUnitForMetric(metricLabel: string): string {
  const label = metricLabel.toLowerCase();
  if (label.includes('co2') || label.includes('carbon')) return 'tons';
  if (label.includes('energy')) return 'MWh';
  if (label.includes('water')) return 'liters';
  if (label.includes('hectares') || label.includes('forest')) return 'hectares';
  if (label.includes('jobs')) return 'jobs';
  return '';
}