import React from "react";

function HourlyForecast({ forecast, data }) {
  console.log("Forecast in HourlyForecast:", forecast);
  console.log("Data in HourlyForecast:", data);
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

  // Get the current time from the API response
  const localTimeStr = data.location.localtime;
  const localTime = new Date(localTimeStr);
  let currentHour = localTime.getHours();
  const currentDay = localTime.getDate();

  // Function to adjust and format hour data
  const adjustHourData = (hourData) => {
    const hourTime = new Date(hourData.time);
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
  if (adjustedForecast.length < 12 && forecast.forecastday.length > 1) {
    const nextDayForecast = forecast.forecastday[1].hour
      .map(adjustHourData)
      .filter((hour) => hour.adjustedDay !== currentDay)
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
