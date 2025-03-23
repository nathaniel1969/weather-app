import React from "react";

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { current, location } = data;
  const date = new Date(current.last_updated);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {location.name}, {location.region}, {location.country}
        </h2>
        <p className="card-text">
          {formattedDate}, {dayOfWeek} {formattedTime}
        </p>
        <div className="d-flex align-items-center">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="me-3"
          />
          <div>
            <h3 className="mb-0">{current.temp_f}°F</h3>
            <p className="mb-0">{current.condition.text}</p>
          </div>
        </div>
        <p className="card-text">Feels Like: {current.feelslike_f}°F</p>
        <p className="card-text">
          Wind: {current.wind_mph} mph {current.wind_dir}
        </p>
        <p className="card-text">Humidity: {current.humidity}%</p>
        {/* Removed sunrise and sunset times */}
      </div>
    </div>
  );
};

export default CurrentWeather;
