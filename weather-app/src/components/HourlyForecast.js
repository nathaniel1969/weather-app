// In HourlyForecast.js (or wherever your HourlyForecast component is)
import React from "react";

function HourlyForecast({ forecast, timezoneOffset }) {
  if (!forecast || !forecast.forecastday || forecast.forecastday.length === 0) {
    return <div>No hourly forecast available.</div>;
  }

  // Get the current time in the target location
  const now = new Date();
  const nowUtc = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // Convert to UTC
  const nowTarget = new Date(nowUtc.getTime() + timezoneOffset * 60000); // Adjust to target timezone
  const currentHour = nowTarget.getHours();

  // Filter and adjust the forecast data
  let adjustedForecast = forecast.forecastday[0].hour
    .map((hourData) => {
      const utcTime = new Date(hourData.time_epoch * 1000); // Convert epoch to milliseconds
      const offsetMilliseconds = timezoneOffset * 60 * 1000; // Convert offset to milliseconds
      const adjustedTime = new Date(utcTime.getTime() + offsetMilliseconds);

      const adjustedHour = adjustedTime.getHours();
      const formattedHour = adjustedHour % 12 || 12; // Convert to 12-hour format
      const ampm = adjustedHour < 12 ? "AM" : "PM";

      return {
        ...hourData,
        adjustedTime: `${formattedHour} ${ampm}`,
        adjustedHour: adjustedHour, // Add adjustedHour for filtering
      };
    })
    .filter((hour) => hour.adjustedHour >= currentHour); // Filter out past hours

  // If there are less than 12 hours left in the day, get the rest from the next day
  if (adjustedForecast.length < 12 && forecast.forecastday.length > 1) {
    const nextDayForecast = forecast.forecastday[1].hour
      .map((hourData) => {
        const utcTime = new Date(hourData.time_epoch * 1000); // Convert epoch to milliseconds
        const offsetMilliseconds = timezoneOffset * 60 * 1000; // Convert offset to milliseconds
        const adjustedTime = new Date(utcTime.getTime() + offsetMilliseconds);

        const adjustedHour = adjustedTime.getHours();
        const formattedHour = adjustedHour % 12 || 12; // Convert to 12-hour format
        const ampm = adjustedHour < 12 ? "AM" : "PM";

        return {
          ...hourData,
          adjustedTime: `${formattedHour} ${ampm}`,
          adjustedHour: adjustedHour, // Add adjustedHour for filtering
        };
      })
      .slice(0, 12 - adjustedForecast.length);
    adjustedForecast.push(...nextDayForecast);
  }
  adjustedForecast = adjustedForecast.slice(0, 12);

  return (
    <div className="hourly-forecast">
      <h2 className="text-center mb-3">Hourly Forecast</h2>
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
        {adjustedForecast.map((hour) => (
          <div key={hour.time_epoch} className="col">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">{hour.adjustedTime}</h5>
                <img
                  src={hour.condition.icon}
                  alt={hour.condition.text}
                  className="weather-icon"
                />
                <p className="card-text">
                  {hour.temp_f}°F / {hour.temp_c}°C
                </p>
                <p className="card-text">{hour.condition.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
