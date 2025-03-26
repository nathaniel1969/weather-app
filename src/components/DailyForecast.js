import React from "react";
import ForecastCard from "./ForecastCard";

const DailyForecast = ({ forecast, data }) => {
  if (
    !forecast ||
    !forecast.forecastday ||
    forecast.forecastday.length === 0 ||
    !data ||
    !data.location
  ) {
    return null;
  }

  // Take the first 8 days directly from the forecast array
  const nextEightDays = forecast.forecastday.slice(0, 8);

  return (
    <div className="row">
      {nextEightDays.map((day, index) => {
        return (
          <div key={index} className="col-md-4 col-lg-3">
            <ForecastCard day={day} locationTimezone={data.location.tz_id} />
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
