import React from "react";
import { useUnit } from "../context/UnitContext";

const CurrentWeather = ({ data }) => {
  // Call the hook FIRST, before any conditional returns
  const { unit } = useUnit();

  if (!data) return null;

  const { current, location, alerts } = data;
  const localTimeStr = location.localtime;

  // Extract year, month, day, hours, and minutes from localTimeStr
  const [datePart, timePart] = localTimeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // Create a Date object using the extracted components
  const localDate = new Date(year, month - 1, day, hours, minutes);

  // Format the date
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // Format the day of the week
  const dayOfWeek = localDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Convert timePart to 12-hour format with am/pm
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  // Remove the zero padding for the hour
  const formattedTime = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  // Determine temperature based on unit
  const temp = unit === "imperial" ? current.temp_f : current.temp_c;
  const tempUnit = unit === "imperial" ? "°F" : "°C";

  // Determine feels like based on unit
  const feelsLike =
    unit === "imperial" ? current.feelslike_f : current.feelslike_c;

  // Determine wind chill based on unit
  const windChill =
    unit === "imperial" ? current.windchill_f : current.windchill_c;

  // Determine heat index based on unit
  const heatIndex =
    unit === "imperial" ? current.heatindex_f : current.heatindex_c;

  // Determine dew point based on unit
  const dewPoint =
    unit === "imperial" ? current.dewpoint_f : current.dewpoint_c;

  // Determine wind speed and gust based on unit
  const windSpeed = unit === "imperial" ? current.wind_mph : current.wind_kph;
  const windGust = unit === "imperial" ? current.gust_mph : current.gust_kph;
  const windSpeedUnit = unit === "imperial" ? "mph" : "kph";

  // Determine pressure based on unit
  const pressure =
    unit === "imperial" ? current.pressure_in : current.pressure_mb;
  const pressureUnit = unit === "imperial" ? "inHg" : "mb";

  // Determine visibility based on unit
  const visibility = unit === "imperial" ? current.vis_miles : current.vis_km;
  const visibilityUnit = unit === "imperial" ? "miles" : "km";

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {location.name}, {location.region}, {location.country}
        </h2>
        <p className="card-text">
          {formattedDate}, {dayOfWeek} {formattedTime}
        </p>
        <div className="d-flex align-items-center mb-3">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="me-3"
          />
          <div>
            <h3 className="mb-0">
              {temp}
              {tempUnit}
            </h3>
            <p className="mb-0">{current.condition.text}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p className="card-text">
              Feels Like: {feelsLike}
              {tempUnit}
            </p>
            {/* Display wind chill only if it's available */}
            {current.windchill_f !== undefined &&
              current.windchill_c !== undefined && (
                <p className="card-text">
                  Wind Chill: {windChill}
                  {tempUnit}
                </p>
              )}
            {/* Display heat index only if it's available */}
            {current.heatindex_f !== undefined &&
              current.heatindex_c !== undefined && (
                <p className="card-text">
                  Heat Index: {heatIndex}
                  {tempUnit}
                </p>
              )}
            <p className="card-text">
              Wind: {windSpeed} {windSpeedUnit} {current.wind_dir}
            </p>
            <p className="card-text">
              Wind Gust: {windGust} {windSpeedUnit}
            </p>
          </div>
          <div className="col-md-6">
            <p className="card-text">
              Pressure: {pressure} {pressureUnit}
            </p>
            <p className="card-text">
              Visibility: {visibility} {visibilityUnit}
            </p>
            <p className="card-text">Humidity: {current.humidity}%</p>
            <p className="card-text">UV Index: {current.uv}</p>
            {/* Display dew point only if it's available */}
            {current.dewpoint_f !== undefined &&
              current.dewpoint_c !== undefined && (
                <p className="card-text">
                  Dew Point: {dewPoint}
                  {tempUnit}
                </p>
              )}
          </div>
        </div>
        {/* Display alerts if there are any */}
        {alerts && alerts.alert && alerts.alert.length > 0 && (
          <div className="mt-3">
            <h4 className="text-danger">Weather Alerts:</h4>
            <ul>
              {alerts.alert.map((alert, index) => (
                <li key={index} className="text-danger">
                  {alert.headline} - {alert.desc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;
