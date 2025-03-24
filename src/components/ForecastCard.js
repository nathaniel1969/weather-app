import React from "react";

const ForecastCard = ({ day, locationTimezone }) => {
  if (!day || !day.astro) {
    return null;
  }

  // Create a Date object using the location's time zone
  const date = new Date(day.date + "T00:00:00");

  const dayOfWeek = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: locationTimezone, // Use the location's time zone
  });

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: locationTimezone, // Use the location's time zone
  });

  // Extract sunrise and sunset times
  let sunriseTime = "";
  let sunsetTime = "";

  if (day.astro && day.astro.sunrise && day.astro.sunset) {
    sunriseTime = new Date(
      day.date + " " + day.astro.sunrise + " UTC"
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: locationTimezone, // Use the location's time zone
    });
    sunsetTime = new Date(
      day.date + " " + day.astro.sunset + " UTC"
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: locationTimezone, // Use the location's time zone
    });
  }

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
          High: {day.day.maxtemp_f}°F / Low: {day.day.mintemp_f}°F
        </p>
        <p className="card-text">
          {day.day.daily_chance_of_rain > 0
            ? `Rain: ${day.day.daily_chance_of_rain}%`
            : ""}
          {day.day.daily_chance_of_snow > 0
            ? `Snow: ${day.day.daily_chance_of_snow}%`
            : ""}
        </p>
        {/* Display sunrise and sunset times on separate lines */}
        <p className="card-text">Sunrise: {sunriseTime}</p>
        <p className="card-text">Sunset: {sunsetTime}</p>
      </div>
    </div>
  );
};

export default ForecastCard;
