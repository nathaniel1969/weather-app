// api .js
import axios from "axios";

const API_KEY = "f7eda145a7984e599f8161315252103"; // Replace with your actual API key
const BASE_URL = "https://api.weatherapi.com/v1"; // Changed to HTTPS

export const getWeatherData = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days: 14,
        aqi: "yes",
        alerts: "yes",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const searchLocations = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching locations:", error);
    return []; // Return an empty array on error to avoid breaking the UI
  }
};

// New function for reverse geocoding
export const getLocationFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: `${latitude},${longitude}`, // Pass coordinates as a string
      },
    });
    if (response.data && response.data.length > 0) {
      return response.data[0].url; // Return the url of the first result
    } else {
      return null; // Return null if no location is found
    }
  } catch (error) {
    console.error("Error getting location from coordinates:", error);
    return null; // Return null on error
  }
};
