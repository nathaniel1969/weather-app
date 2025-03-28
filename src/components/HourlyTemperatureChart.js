// src/components/HourlyTemperatureChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useUnit } from "../context/UnitContext";

ChartJS.register(
  CategoryScale,
  ChartDataLabels,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HourlyTemperatureChart = ({
  adjustedForecast,
  hoursToShow,
  setHoursToShow,
}) => {
  const { unit } = useUnit();

  if (adjustedForecast.length === 0) {
    return null;
  }

  const labels = adjustedForecast.map((hour) => hour.adjustedTime);
  const temperatureData = adjustedForecast.map((hour) =>
    unit === "imperial" ? hour.temp_f : hour.temp_c
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Temperature (${unit === "imperial" ? "°F" : "°C"})`,
        data: temperatureData,
        fill: false,
        borderColor: "rgb(75, 192, 192)", // Teal
        tension: 0.1,
        pointRadius: 5, // Make the points more visible
        pointHoverRadius: 8, // Increase the size of the point on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Hourly Temperature Trend",
      },
      tooltip: {
        enabled: false, // Disable the default tooltip
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => `${value}°`, // Format the label to include the degree symbol
      },
    },
    scales: {
      x: {
        position: "top", // Move x-axis labels to the top
        grid: {
          display: false, // Remove x-axis grid lines
        },
        ticks: {
          padding: 40, // Add padding to the top of the x-axis labels
        },
        border: {
          display: false, // Remove x-axis line
        },
      },
      y: {
        display: false, // Remove y-axis scale
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
  };

  return (
    <div className="mt-4">
      <div className="mb-3">
        <label htmlFor="hoursToShow" className="me-2">
          Show Hours:
        </label>
        <select
          id="hoursToShow"
          value={hoursToShow}
          onChange={(e) => setHoursToShow(parseInt(e.target.value))}
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>
      <div aria-describedby="chartDescription">
        <p id="chartDescription" className="visually-hidden">
          This chart shows the hourly temperature trend for the next{" "}
          {hoursToShow} hours.
        </p>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HourlyTemperatureChart;
