import React from "react";
import { useUnit } from "../context/UnitContext";

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { unit } = useUnit();
  const { current, location } = data;
  const localTimeStr = location.localtime;
  console.log("localTimeStr:", localTimeStr);

  // Extract year, month, day, hours, and minutes from localTimeStr
  const [datePart, timePart] = localTimeStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // Create a Date object using the extracted components
  const localDate = new Date(year, month - 1, day, hours, minutes);
  console.log("localDate:", localDate);

  // Format the date
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  console.log("formattedDate:", formattedDate);

  // Format the day of the week
  const dayOfWeek = localDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  console.log("dayOfWeek:", dayOfWeek);

  // Convert timePart to 12-hour format with am/pm
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  const formattedTime = `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  console.log("formattedTime:", formattedTime);

  // Determine temperature and feels like based on unit
  const temp = unit === "imperial" ? current.temp_f : current.temp_c;
  const feelsLike =
    unit === "imperial" ? current.feelslike_f : current.feelslike_c;
  const tempUnit = unit === "imperial" ? "°F" : "°C";

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {location.name}, {location.region}, {location.country}
        </h2>
        <p className="card-text">
          {formattedDate}, {dayOfWeek} {formattedTime}
        </p>
        <div className="d-flex align-items-center">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="me-3"
          />
          <div>
            <h3 className="mb-0">
              {temp}
              {tempUnit}
            </h3>
            <p className="mb-0">{current.condition.text}</p>
          </div>
        </div>
        <p className="card-text">
          Feels Like: {feelsLike}
          {tempUnit}
        </p>
        <p className="card-text">
          Wind: {current.wind_mph} mph {current.wind_dir}
        </p>
        <p className="card-text">Humidity: {current.humidity}%</p>
      </div>
    </div>
  );
};

export default CurrentWeather;
