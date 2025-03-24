import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import { getWeatherData, getCurrentWeatherData } from "./api";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [location, setLocation] = useState("New York");
  const [timezoneOffset, setTimezoneOffset] = useState(0); // New state for timezone offset

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeatherData(location);
        setWeatherData(data);
        // Extract timezone offset from the API response
        if (data && data.location && data.location.tz_offset) {
          setTimezoneOffset(data.location.tz_offset);
        } else {
          setTimezoneOffset(0); // Default to 0 if not available
        }
      } catch (error) {
        console.error("Error in App.js:", error);
        setWeatherData(null);
        setTimezoneOffset(0); // Reset on error
      }
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        const data = await getCurrentWeatherData(location);
        setCurrentWeatherData(data);
      } catch (error) {
        console.error("Error in App.js:", error);
        setCurrentWeatherData(null);
      }
    };
    fetchCurrentData();
  }, [location]);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      {currentWeatherData && <CurrentWeather data={currentWeatherData} />}
      {weatherData && <DailyForecast forecast={weatherData.forecast} />}
      {weatherData && (
        <HourlyForecast
          forecast={weatherData.forecast}
          timezoneOffset={timezoneOffset} // Pass the timezone offset to HourlyForecast
        />
      )}
    </div>
  );
}

export default App;
