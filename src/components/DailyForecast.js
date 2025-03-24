import React from "react";
import ForecastCard from "./ForecastCard";

const DailyForecast = ({ forecast, data }) => {
  console.log("forecast (DailyForecast.js):", forecast); // Check forecast prop
  console.log("data (DailyForecast.js):", data); // Check data prop
  if (
    !forecast ||
    !forecast.forecastday ||
    !data ||
    !data.location ||
    !data.location.localtime
  ) {
    console.log("DailyForecast.js: Returning null due to missing data.");
    return null;
  }

  // Get the current date and time from the API response
  const now = new Date(data.location.localtime);

  // Filter out today and previous days, then take the next 7 days
  const nextSevenDays = forecast.forecastday
    .filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate > now;
    })
    .slice(0, 7);

  console.log("nextSevenDays (DailyForecast.js):", nextSevenDays); // Check filtered data

  return (
    <div className="row">
      {nextSevenDays.map((day, index) => {
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
