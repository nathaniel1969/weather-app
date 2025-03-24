import axios from "axios";

const API_KEY = "f7eda145a7984e599f8161315252103"; // Replace with your actual API key
const BASE_URL = "http://api.weatherapi.com/v1";

export const getWeatherData = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days: 8, // Current day + 7 days forecast
        aqi: "no",
        alerts: "no",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
