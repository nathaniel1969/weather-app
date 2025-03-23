import React from "react";
import ForecastCard from "./ForecastCard";

const DailyForecast = ({ forecast }) => {
  if (!forecast || !forecast.forecastday) return null;

  return (
    <div className="row">
      {forecast.forecastday.slice(1).map((day, index) => (
        <div key={index} className="col-md-4 col-lg-3">
          <ForecastCard day={day} />
        </div>
      ))}
    </div>
  );
};

export default DailyForecast;
