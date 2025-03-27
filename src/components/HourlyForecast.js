import React from "react";
import { useUnit } from "../context/UnitContext";

function HourlyForecast({ adjustedForecast, hoursToShow, setHoursToShow }) {
  const { unit } = useUnit();

  if (adjustedForecast.length === 0) {
    return <div>No hourly forecast available.</div>;
  }

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
