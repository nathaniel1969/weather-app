// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import { getWeatherData, getLocationFromCoordinates } from "./api"; // Import the new function
import "./App.css";
import UnitToggle from "./components/UnitToggle"; // Import the toggle
import HourlyTemperatureChart from "./components/HourlyTemperatureChart"; // Import the new component
import HourlyForecast from "./components/HourlyForecast";
import { processHourlyForecast } from "./utils";
import Favorites from "./components/Favorites"; // Import the new component

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null); // Changed to null initially
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoursToShow, setHoursToShow] = useState(12);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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

  const fetchWeatherData = useCallback(async (locationToFetch) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(locationToFetch);
      setWeatherData(data);
    } catch (error) {
      console.error("Error in App.js:", error);
      setError("Failed to load weather data.");
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationFromCoords = await getLocationFromCoordinates(
              latitude,
              longitude
            );
            if (locationFromCoords) {
              setLocation(locationFromCoords);
            } else {
              setLocation("New York"); // Default location if reverse geocoding fails
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocation("New York"); // Default location on error
          }
        );
      } else {
        setLocation("New York"); // Default location if geolocation is not supported
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location, fetchWeatherData]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
  };

  const handleAddToFavorites = useCallback(() => {
    if (weatherData && weatherData.location) {
      const newFavorite = `${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`;
      if (!favorites.includes(newFavorite)) {
        setFavorites([...favorites, newFavorite]);
      }
    }
  }, [favorites, weatherData]);

  const handleRemoveFromFavorites = useCallback(
    (favoriteToRemove) => {
      setFavorites(favorites.filter((fav) => fav !== favoriteToRemove));
    },
    [favorites]
  );

  const handleSelectFavorite = useCallback((favorite) => {
    setLocation(favorite);
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">Weather App</h1>
        <UnitToggle /> {/* Add the toggle here */}
      </div>
      <SearchBar onSearch={handleSearch} />
      {weatherData && (
        <button className="btn btn-primary mb-3" onClick={handleAddToFavorites}>
          Add to Favorites
        </button>
      )}
      <Favorites
        favorites={favorites}
        onSelectFavorite={handleSelectFavorite}
        onRemoveFavorite={handleRemoveFromFavorites}
      />
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
