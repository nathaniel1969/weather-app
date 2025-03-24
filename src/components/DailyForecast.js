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

  // Extract the date portion from the local time string
  const localDateStr = data.location.localtime.split(" ")[0]; // e.g., "2024-03-25"
  const today = new Date(localDateStr); // Create a Date object from the date string

  // Filter out today and previous days, then take the next 7 days
  const nextSevenDays = forecast.forecastday
    .filter((day) => {
      const dayDate = new Date(day.date);
      return dayDate > today;
    })
    .slice(0, 7);

  console.log("nextSevenDays (DailyForecast.js):", nextSevenDays); // Check filtered data

  return (
    <div className="row">
      {nextSevenDays.map((day, index) => (
        <div key={index} className="col-md-4 col-lg-3">
          <ForecastCard day={day} />
        </div>
      ))}
    </div>
  );
};

export default DailyForecast;
