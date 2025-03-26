import React, { useState } from "react";
import { useUnit } from "../context/UnitContext";

function HourlyForecast({ forecast, data }) {
  // Call Hooks FIRST, before any conditional returns
  const { unit } = useUnit();
  const [hoursToShow, setHoursToShow] = useState(12); // Default to 12 hours

  // Now, the conditional return
  if (
    !forecast ||
    !forecast.forecastday ||
    forecast.forecastday.length === 0 ||
    !data ||
    !data.location ||
    !data.location.localtime
  ) {
    return <div>No hourly forecast available.</div>;
  }

  // ... (rest of your code)
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

  // If there are less than 12 hours left in the day, get the rest from the next day
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

  const tempUnit = unit === "imperial" ? "°F" : "°C";
  return (
    <div className="hourly-forecast">
      <h2 className="text-center mb-3">Hourly Forecast</h2>
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
      <div className="hourly-cards-container">
        {adjustedForecast.map((hour) => (
          <div key={hour.time_epoch} className="col">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">{hour.adjustedTime}</h5>
                <img
                  src={hour.condition.icon}
                  alt={hour.condition.text}
                  className="weather-icon mb-2"
                />
                <p className="card-text">
                  {unit === "imperial" ? hour.temp_f : hour.temp_c}
                  {tempUnit}
                </p>
                <p className="card-text">{hour.condition.text}</p>
                <p className="card-text">
                  Pressure:{" "}
                  {unit === "imperial"
                    ? hour.pressure_in + " inHg"
                    : hour.pressure_mb + " mb"}
                </p>
                <p className="card-text">UV Index: {hour.uv}</p>
                <p className="card-text">Humidity: {hour.humidity}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
