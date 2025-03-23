import React from "react";

const HourlyForecast = ({ forecast }) => {
  if (!forecast || !forecast.forecastday || forecast.forecastday.length === 0)
    return null;

  const today = forecast.forecastday[0];
  const now = new Date();
  const currentHour = now.getHours();

  // Find the index of the next full hour
  const nextHourIndex = today.hour.findIndex((hourData) => {
    const hour = new Date(hourData.time).getHours();
    return hour > currentHour;
  });

  // If no future hour is found, start from the beginning
  const startIndex = nextHourIndex === -1 ? 0 : nextHourIndex;

  // Get the next 12 hours, starting from the next full hour
  // Changed from 10 to 12
  const hourlyData = today.hour.slice(startIndex, startIndex + 12);

  return (
    <div className="row">
      {hourlyData.map((hour, index) => {
        const time = new Date(hour.time).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });
        return (
          <div key={index} className="col-md-4 col-lg-2">
            <div className="card rounded-3 mb-3">
              <div className="card-body text-center">
                <h6 className="card-title">{time}</h6>
                <img
                  src={hour.condition.icon}
                  alt={hour.condition.text}
                  className="mb-2"
                />
                <p className="card-text">{hour.temp_f}°F</p>
                <p className="card-text">
                  {hour.chance_of_rain > 0
                    ? `Rain: ${hour.chance_of_rain}%`
                    : ""}
                  {hour.chance_of_snow > 0
                    ? `Snow: ${hour.chance_of_snow}%`
                    : ""}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HourlyForecast;
