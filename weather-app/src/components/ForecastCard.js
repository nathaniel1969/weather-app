import React from "react";

const ForecastCard = ({ day }) => {
  if (!day || !day.astro) {
    return null; // Or return a placeholder/error message
  }
  const date = new Date(day.date);

  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  // Extract sunrise and sunset times
  let sunriseTime = "";
  let sunsetTime = "";

  if (day.astro && day.astro.sunrise && day.astro.sunset) {
    sunriseTime = new Date(
      day.date + " " + day.astro.sunrise
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    sunsetTime = new Date(day.date + " " + day.astro.sunset).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );
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
