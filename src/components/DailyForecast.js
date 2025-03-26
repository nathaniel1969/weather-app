import React from "react";
import ForecastCard from "./ForecastCard";

const DailyForecast = ({ forecast, data }) => {
  console.log("forecast (DailyForecast.js):", forecast); // Check forecast prop
  console.log("data (DailyForecast.js):", data); // Check data prop

  if (
    !forecast ||
    !forecast.forecastday ||
    forecast.forecastday.length === 0 ||
    !data ||
    !data.location
  ) {
    console.log("DailyForecast.js: Returning null due to missing data.");
    return null;
  }

  // Take the first 8 days directly from the forecast array
  const nextEightDays = forecast.forecastday.slice(0, 8);

  console.log("nextEightDays (DailyForecast.js):", nextEightDays); // Check data

  return (
    <div className="row">
      {nextEightDays.map((day, index) => {
        console.log("Day being passed to ForecastCard:", day);
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
