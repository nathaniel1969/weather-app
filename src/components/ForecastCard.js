import React, { useMemo } from "react";
import { useUnit } from "../context/UnitContext";
import { formatDate, formatTime } from "../utils";

const ForecastCard = React.memo(({ day }) => {
  const { unit } = useUnit();

  // Default values for when day or day.astro is not available
  const defaultDay = {
    date: "",
    day: {
      maxtemp_f: 0,
      maxtemp_c: 0,
      mintemp_f: 0,
      mintemp_c: 0,
      maxwind_mph: 0,
      maxwind_kph: 0,
      condition: { icon: "", text: "" },
      daily_chance_of_rain: 0,
      daily_chance_of_snow: 0,
      avgvis_miles: 0,
      avgvis_km: 0,
      avghumidity: 0,
      uv: 0,
      wind_dir: "",
    },
    totalprecip_in: 0,
    totalprecip_mm: 0,
    astro: { sunrise: "", sunset: "" },
  };

  const currentDay = day || defaultDay;

  const date = useMemo(() => {
    if (!currentDay.date) return new Date();
    const [year, month, dayOfMonth] = currentDay.date.split("-").map(Number);
    return new Date(year, month - 1, dayOfMonth);
  }, [currentDay.date]);

  const dayOfWeek = useMemo(
    () =>
      currentDay.date ? formatDate(currentDay.date, { weekday: "long" }) : "",
    [currentDay.date]
  );
  const formattedDate = useMemo(
    () =>
      currentDay.date
        ? formatDate(currentDay.date, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
    [currentDay.date]
  );

  const sunriseTime = useMemo(() => {
    if (currentDay.astro && currentDay.astro.sunrise) {
      return formatTime(currentDay.astro.sunrise, date);
    }
    return "";
  }, [currentDay.astro, date]);

  const sunsetTime = useMemo(() => {
    if (currentDay.astro && currentDay.astro.sunset) {
      return formatTime(currentDay.astro.sunset, date);
    }
    return "";
  }, [currentDay.astro, date]);

  const maxTemp = useMemo(
    () =>
      unit === "imperial" ? currentDay.day.maxtemp_f : currentDay.day.maxtemp_c,
    [unit, currentDay.day.maxtemp_f, currentDay.day.maxtemp_c]
  );
  const minTemp = useMemo(
    () =>
      unit === "imperial" ? currentDay.day.mintemp_f : currentDay.day.mintemp_c,
    [unit, currentDay.day.mintemp_f, currentDay.day.mintemp_c]
  );
  const tempUnit = useMemo(() => (unit === "imperial" ? "°F" : "°C"), [unit]);

  const maxWind = useMemo(
    () =>
      unit === "imperial"
        ? currentDay.day.maxwind_mph
        : currentDay.day.maxwind_kph,
    [unit, currentDay.day.maxwind_mph, currentDay.day.maxwind_kph]
  );
  const windSpeedUnit = useMemo(
    () => (unit === "imperial" ? "mph" : "kph"),
    [unit]
  );

  const totalPrecip = useMemo(
    () =>
      unit === "imperial"
        ? currentDay.totalprecip_in
        : currentDay.totalprecip_mm,
    [unit, currentDay.totalprecip_in, currentDay.totalprecip_mm]
  );
  const precipUnit = useMemo(() => (unit === "imperial" ? "in" : "mm"), [unit]);

  const avgVis = useMemo(
    () =>
      unit === "imperial"
        ? currentDay.day.avgvis_miles
        : currentDay.day.avgvis_km,
    [unit, currentDay.day.avgvis_miles, currentDay.day.avgvis_km]
  );
  const visUnit = useMemo(() => (unit === "imperial" ? "miles" : "km"), [unit]);

  if (!day || !day.astro) {
    return null;
  }

  return (
    <div className="card rounded-3 mb-3">
      <div className="card-body text-center">
        <h3 className="card-title">{dayOfWeek}</h3>
        <p className="card-text">{formattedDate}</p>
        <img
          src={currentDay.day.condition.icon}
          alt={currentDay.day.condition.text}
          className="mb-2"
        />
        <dl>
          <dt>
            <h4>Temperature</h4>
          </dt>
          <dd className="card-text">
            High: {maxTemp}
            {tempUnit} / Low: {minTemp}
            {tempUnit}
          </dd>
          {currentDay.day.daily_chance_of_rain > 0 && (
            <>
              <dt>
                <h4>Rain</h4>
              </dt>
              <dd className="card-text">
                {currentDay.day.daily_chance_of_rain}%
              </dd>
            </>
          )}
          {currentDay.day.daily_chance_of_snow > 0 && (
            <>
              <dt>
                <h4>Snow</h4>
              </dt>
              <dd className="card-text">
                {currentDay.day.daily_chance_of_snow}%
              </dd>
            </>
          )}
          {totalPrecip > 0 && (
            <>
              <dt>
                <h4>Total Precipitation</h4>
              </dt>
              <dd className="card-text">
                {totalPrecip} {precipUnit}
              </dd>
            </>
          )}
          <dt>
            <h4>Wind</h4>
          </dt>
          <dd className="card-text">
            {maxWind} {windSpeedUnit} {currentDay.day.wind_dir}
          </dd>
          <dt>
            <h4>Average Visibility</h4>
          </dt>
          <dd className="card-text">
            {avgVis} {visUnit}
          </dd>
          <dt>
            <h4>Average Humidity</h4>
          </dt>
          <dd className="card-text">{currentDay.day.avghumidity}%</dd>
          <dt>
            <h4>UV Index</h4>
          </dt>
          <dd className="card-text">{currentDay.day.uv}</dd>
          <dt>
            <h4>Sunrise</h4>
          </dt>
          <dd className="card-text">{sunriseTime}</dd>
          <dt>
            <h4>Sunset</h4>
          </dt>
          <dd className="card-text">{sunsetTime}</dd>
        </dl>
      </div>
    </div>
  );
});

export default ForecastCard;
