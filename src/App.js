import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import { getWeatherData } from "./api";
import "./App.css";
import UnitToggle from "./components/UnitToggle"; // Import the toggle

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("New York");
  const [displayLocation, setDisplayLocation] = useState("New York");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(location);
        setWeatherData(data);
        if (data && data.location) {
          setDisplayLocation(
            `${data.location.name}, ${data.location.region}, ${data.location.country}`
          );
        }
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
