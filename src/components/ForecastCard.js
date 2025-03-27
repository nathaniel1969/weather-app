import React from "react";
import { useUnit } from "../context/UnitContext";

const ForecastCard = ({ day, locationTimezone }) => {
  // Call the hook FIRST, before any conditional returns
  const { unit } = useUnit();

  if (!day || !day.astro) {
    return null;
  }

  // Extract year, month, and day from day.date
  const [year, month, dayOfMonth] = day.date.split("-").map(Number);

  // Create a Date object using the extracted components
  const date = new Date(year, month - 1, dayOfMonth);

  // Format the day of the week
  const dayOfWeek = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // Extract sunrise and sunset times
  let sunriseTime = "";
  let sunsetTime = "";

  if (day.astro && day.astro.sunrise && day.astro.sunset) {
    // Extract hours and minutes from sunrise
    const [sunriseHours, sunriseMinutes] = day.astro.sunrise
      .split(/[:\s]/)
      .map(Number);
    // Create a Date object for sunrise
    const sunriseDate = new Date(
      year,
      month - 1,
      dayOfMonth,
      sunriseHours,
      sunriseMinutes
    );
    sunriseTime = sunriseDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Extract hours and minutes from sunset
    const [sunsetHours, sunsetMinutes] = day.astro.sunset
      .split(/[:\s]/)
      .map(Number);
    // Create a Date object for sunset
    const sunsetDate = new Date(
      year,
      month - 1,
      dayOfMonth,
      sunsetHours,
      sunsetMinutes
    );
    sunsetTime = sunsetDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  // Determine temperature based on unit
  const maxTemp = unit === "imperial" ? day.day.maxtemp_f : day.day.maxtemp_c;
  const minTemp = unit === "imperial" ? day.day.mintemp_f : day.day.mintemp_c;
  const tempUnit = unit === "imperial" ? "°F" : "°C";

  // Determine wind speed based on unit
  const maxWind =
    unit === "imperial" ? day.day.maxwind_mph : day.day.maxwind_kph;
  const windSpeedUnit = unit === "imperial" ? "mph" : "kph";

  //Determine total precipitation based on unit
  const totalPrecip =
    unit === "imperial" ? day.totalprecip_in : day.totalprecip_mm;
  const precipUnit = unit === "imperial" ? "in" : "mm";

  //Determine average visibility based on unit
  const avgVis = unit === "imperial" ? day.day.avgvis_miles : day.day.avgvis_km;
  const visUnit = unit === "imperial" ? "miles" : "km";

  return (
    <div className="card rounded-3 mb-3">
      <div className="card-body text-center">
        <h5 className="card-title">{dayOfWeek}</h5>
        <p className="card-text">{formattedDate}</p>
        <img
          src={day.day.condition.icon}
          alt={day.day.condition.text}
          className="mb-2"
        />
        <p className="card-text">
          High: {maxTemp}
          {tempUnit} / Low: {minTemp}
          {tempUnit}
        </p>
        {/* Conditionally render precipitation information */}
        {day.day.daily_chance_of_rain > 0 && (
          <p className="card-text">Rain: {day.day.daily_chance_of_rain}%</p>
        )}
        {day.day.daily_chance_of_snow > 0 && (
          <p className="card-text">Snow: {day.day.daily_chance_of_snow}%</p>
        )}
        {totalPrecip > 0 && (
          <p className="card-text">
            Total Precipitation: {totalPrecip} {precipUnit}
          </p>
        )}
        <p className="card-text">
          Wind: {maxWind} {windSpeedUnit} {day.day.wind_dir}
        </p>
        <p className="card-text">
          Average Visibility: {avgVis} {visUnit}
        </p>
        <p className="card-text">Average Humidity: {day.day.avghumidity}%</p>
        <p className="card-text">UV Index: {day.day.uv}</p>
        {/* Display sunrise and sunset times on separate lines */}
        <p className="card-text">Sunrise: {sunriseTime}</p>
        <p className="card-text">Sunset: {sunsetTime}</p>
      </div>
    </div>
  );
};

export default ForecastCard;
