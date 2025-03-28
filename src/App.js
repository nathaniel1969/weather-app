// src/App.js
import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import { getWeatherData } from "./api";
import "./App.css";
import UnitToggle from "./components/UnitToggle"; // Import the toggle
import HourlyTemperatureChart from "./components/HourlyTemperatureChart"; // Import the new component
import HourlyForecast from "./components/HourlyForecast";
import { processHourlyForecast } from "./utils";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("New York");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoursToShow, setHoursToShow] = useState(12);

  const localDate = useMemo(() => {
    if (
      !weatherData ||
      !weatherData.location ||
      !weatherData.location.localtime
    )
      return null;
    const localTimeStr = weatherData.location.localtime;
    const [datePart, timePart] = localTimeStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }, [weatherData]);

  const adjustedForecast = useMemo(() => {
    if (!weatherData || !weatherData.forecast || !localDate) return [];
    return processHourlyForecast(weatherData.forecast, localDate, hoursToShow);
  }, [weatherData, localDate, hoursToShow]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(location);
        setWeatherData(data);
      } catch (error) {
        console.error("Error in App.js:", error);
        setError("Failed to load weather data.");
        setWeatherData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location]);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Weather App</h1>
        <UnitToggle /> {/* Add the toggle here */}
      </div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && (
        <div className="text-center" aria-live="polite">
          Loading...
        </div>
      )}
      {error && (
        <div className="text-center text-danger" aria-live="polite">
          {error}
        </div>
      )}
      {!isLoading && weatherData && <CurrentWeather data={weatherData} />}
      {!isLoading && weatherData && (
        <DailyForecast forecast={weatherData.forecast} data={weatherData} />
      )}
      {!isLoading && weatherData && (
        <HourlyForecast
          adjustedForecast={adjustedForecast}
          hoursToShow={hoursToShow}
          setHoursToShow={setHoursToShow}
        />
      )}
      {!isLoading && weatherData && (
        <HourlyTemperatureChart
          adjustedForecast={adjustedForecast}
          hoursToShow={hoursToShow}
          setHoursToShow={setHoursToShow}
        />
      )}
    </div>
  );
}

export default App;
