import React, { useMemo } from "react";
import { useUnit } from "../context/UnitContext";
import { formatDate, formatTime } from "../utils";

const CurrentWeather = React.memo(({ data }) => {
  const { unit } = useUnit();

  // Default values for when data is not available
  const defaultCurrent = {
    condition: { icon: "", text: "" },
    temp_f: 0,
    temp_c: 0,
    feelslike_f: 0,
    feelslike_c: 0,
    windchill_f: undefined,
    windchill_c: undefined,
    heatindex_f: undefined,
    heatindex_c: undefined,
    dewpoint_f: undefined,
    dewpoint_c: undefined,
    wind_mph: 0,
    wind_kph: 0,
    wind_dir: "",
    gust_mph: 0,
    gust_kph: 0,
    pressure_in: 0,
    pressure_mb: 0,
    vis_miles: 0,
    vis_km: 0,
    humidity: 0,
    uv: 0,
  };
  const defaultLocation = {
    name: "",
    region: "",
    country: "",
    localtime: "",
  };
  const defaultAlerts = { alert: [] };

  const current = data ? data.current : defaultCurrent;
  const location = data ? data.location : defaultLocation;
  const alerts = data ? data.alerts : defaultAlerts;
  const localTimeStr = location.localtime;

  const localDate = useMemo(() => {
    if (!localTimeStr) return new Date();
    const [datePart, timePart] = localTimeStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }, [localTimeStr]);

  const formattedDate = useMemo(
    () =>
      localTimeStr
        ? formatDate(localTimeStr.split(" ")[0], {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
    [localTimeStr]
  );
  const dayOfWeek = useMemo(
    () =>
      localTimeStr
        ? formatDate(localTimeStr.split(" ")[0], { weekday: "long" })
        : "",
    [localTimeStr]
  );

  const formattedTime = useMemo(
    () =>
      localTimeStr ? formatTime(localTimeStr.split(" ")[1], localDate) : "",
    [localTimeStr, localDate]
  );

  const temp = useMemo(
    () => (unit === "imperial" ? current.temp_f : current.temp_c),
    [unit, current.temp_f, current.temp_c]
  );
  const tempUnit = useMemo(() => (unit === "imperial" ? "°F" : "°C"), [unit]);
  const feelsLike = useMemo(
    () => (unit === "imperial" ? current.feelslike_f : current.feelslike_c),
    [unit, current.feelslike_f, current.feelslike_c]
  );
  const windChill = useMemo(
    () => (unit === "imperial" ? current.windchill_f : current.windchill_c),
    [unit, current.windchill_f, current.windchill_c]
  );
  const heatIndex = useMemo(
    () => (unit === "imperial" ? current.heatindex_f : current.heatindex_c),
    [unit, current.heatindex_f, current.heatindex_c]
  );
  const dewPoint = useMemo(
    () => (unit === "imperial" ? current.dewpoint_f : current.dewpoint_c),
    [unit, current.dewpoint_f, current.dewpoint_c]
  );
  const windSpeed = useMemo(
    () => (unit === "imperial" ? current.wind_mph : current.wind_kph),
    [unit, current.wind_mph, current.wind_kph]
  );
  const windGust = useMemo(
    () => (unit === "imperial" ? current.gust_mph : current.gust_kph),
    [unit, current.gust_mph, current.gust_kph]
  );
  const windSpeedUnit = useMemo(
    () => (unit === "imperial" ? "mph" : "kph"),
    [unit]
  );
  const pressure = useMemo(
    () => (unit === "imperial" ? current.pressure_in : current.pressure_mb),
    [unit, current.pressure_in, current.pressure_mb]
  );
  const pressureUnit = useMemo(
    () => (unit === "imperial" ? "inHg" : "mb"),
    [unit]
  );
  const visibility = useMemo(
    () => (unit === "imperial" ? current.vis_miles : current.vis_km),
    [unit, current.vis_miles, current.vis_km]
  );
  const visibilityUnit = useMemo(
    () => (unit === "imperial" ? "miles" : "km"),
    [unit]
  );

  if (!data) return null;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {location.name}, {location.region}, {location.country}
        </h2>
        <p className="card-text">
          {formattedDate}, {dayOfWeek} {formattedTime}
        </p>
        <div className="d-flex align-items-center mb-3">
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
        <div className="row">
          <div className="col-md-6">
            <p className="card-text">
              Feels Like: {feelsLike}
              {tempUnit}
            </p>
            {/* Display wind chill only if it's available */}
            {current.windchill_f !== undefined &&
              current.windchill_c !== undefined && (
                <p className="card-text">
                  Wind Chill: {windChill}
                  {tempUnit}
                </p>
              )}
            {/* Display heat index only if it's available */}
            {current.heatindex_f !== undefined &&
              current.heatindex_c !== undefined && (
                <p className="card-text">
                  Heat Index: {heatIndex}
                  {tempUnit}
                </p>
              )}
            <p className="card-text">
              Wind: {windSpeed} {windSpeedUnit} {current.wind_dir}
            </p>
            <p className="card-text">
              Wind Gust: {windGust} {windSpeedUnit}
            </p>
          </div>
          <div className="col-md-6">
            <p className="card-text">
              Pressure: {pressure} {pressureUnit}
            </p>
            <p className="card-text">
              Visibility: {visibility} {visibilityUnit}
            </p>
            <p className="card-text">Humidity: {current.humidity}%</p>
            <p className="card-text">UV Index: {current.uv}</p>
            {/* Display dew point only if it's available */}
            {current.dewpoint_f !== undefined &&
              current.dewpoint_c !== undefined && (
                <p className="card-text">
                  Dew Point: {dewPoint}
                  {tempUnit}
                </p>
              )}
          </div>
        </div>
        {/* Display alerts if there are any */}
        {alerts && alerts.alert && alerts.alert.length > 0 && (
          <div className="mt-3">
            <h4 className="text-danger">Weather Alerts:</h4>
            <ul>
              {alerts.alert.map((alert, index) => (
                <li key={index} className="text-danger">
                  {alert.headline} - {alert.desc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

export default CurrentWeather;
