// src/components/HourlyTemperatureChart.js
import React, { useState } from "react";
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

const HourlyTemperatureChart = ({ forecast, data }) => {
  const { unit } = useUnit();
  const [hoursToShow, setHoursToShow] = useState(12); // Default to 12 hours

  if (
    !forecast ||
    !forecast.forecastday ||
    forecast.forecastday.length === 0 ||
    !data ||
    !data.location ||
    !data.location.localtime
  ) {
    return null;
  }

  // Get the current time from the API response
  const localTimeStr = data.location.localtime;

  // Extract year, month, day, hours, and minutes from localTimeStr
  const [datePart, timePart] = localTimeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // Create a Date object using the extracted components
  const localDate = new Date(year, month - 1, day, hours, minutes);
  let currentHour = localDate.getHours();
  const currentDay = localDate.getDate();

  // Function to adjust and format hour data
  const adjustHourData = (hourData) => {
    // Extract year, month, day, hours, and minutes from hourData.time
    const [hourDatePart, hourTimePart] = hourData.time.split(" ");
    const [hourYear, hourMonth, hourDay] = hourDatePart.split("-").map(Number);
    const [hourHours, hourMinutes] = hourTimePart.split(":").map(Number);

    // Create a Date object using the extracted components
    const hourTime = new Date(
      hourYear,
      hourMonth - 1,
      hourDay,
      hourHours,
      hourMinutes
    );
    const adjustedHour = hourTime.getHours();
    const formattedHour = adjustedHour % 12 || 12; // Convert to 12-hour format
    const ampm = adjustedHour < 12 ? "AM" : "PM";
    const adjustedDay = hourTime.getDate();

    return {
      ...hourData,
      adjustedTime: `${formattedHour} ${ampm}`,
      adjustedHour: adjustedHour,
      adjustedDay: adjustedDay,
    };
  };

  // Process the current day's forecast
  // Start from the next hour
  currentHour = (currentHour + 1) % 24;
  let adjustedForecast = forecast.forecastday[0].hour
    .map(adjustHourData)
    .filter((hour) => {
      return (
        hour.adjustedDay === currentDay && hour.adjustedHour >= currentHour
      );
    });

  // If there are less than the selected hours left in the day, get the rest from the next day
  if (
    adjustedForecast.length < hoursToShow &&
    forecast.forecastday.length > 1
  ) {
    const nextDayForecast = forecast.forecastday[1].hour
      .map(adjustHourData)
      .filter((hour) => hour.adjustedDay !== currentDay)
      .slice(0, hoursToShow - adjustedForecast.length);
    adjustedForecast.push(...nextDayForecast);
  }
  adjustedForecast = adjustedForecast.slice(0, hoursToShow);

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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HourlyTemperatureChart;
