import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import { getWeatherData } from "./api";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("New York");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(location);
        console.log("API Response (App.js):", data); // Check API response
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

  console.log("weatherData (App.js):", weatherData); // Check weatherData state

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-danger">{error}</div>}
      {!isLoading && weatherData && <CurrentWeather data={weatherData} />}
      {!isLoading && weatherData && (
        <DailyForecast forecast={weatherData.forecast} data={weatherData} />
      )}
      {!isLoading && weatherData && (
        <HourlyForecast forecast={weatherData.forecast} data={weatherData} /> // Pass the entire weatherData
      )}
    </div>
  );
}

export default App;
