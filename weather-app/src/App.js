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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeatherData(location);
        setWeatherData(data);
      } catch (error) {
        console.error("Error in App.js:", error);
        setWeatherData(null);
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
      {weatherData && <HourlyForecast forecast={weatherData.forecast} />}
    </div>
  );
}

export default App;
