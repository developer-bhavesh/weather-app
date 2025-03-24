import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WeatherContext = createContext();

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const CITY_STORAGE_KEY = "savedCityData"; // Store full city details

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("Vadodara");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved city details when app starts
  useEffect(() => {
    const loadCityData = async () => {
      try {
        const savedCityData = await AsyncStorage.getItem(CITY_STORAGE_KEY);
        if (savedCityData) {
          const parsedData = JSON.parse(savedCityData);
          setCity(parsedData.city);
          setLocation(parsedData);
        }
      } catch (err) {
        console.error("Error loading city details from storage:", err);
      }
    };

    loadCityData();
  }, []);

  useEffect(() => {
    if (city) fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    if (!API_KEY) {
      console.error("API key is missing! Check your .env file.");
      setError("Missing API Key");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const GEO_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
      const geoRes = await axios.get(GEO_URL);
      if (!geoRes.data.length) {
        throw new Error("City not found");
      }

      const { name, state, country, lat, lon } = geoRes.data[0];
      const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(WEATHER_URL),
        axios.get(FORECAST_URL),
      ]);

      if (weatherRes.status !== 200 || forecastRes.status !== 200) {
        throw new Error("Invalid API response");
      }

      const locationData = { city: name, state, country, lat, lon };
      setLocation(locationData);

      setWeather({
        temp: Math.round(weatherRes.data.main.temp),
        humidity: weatherRes.data.main.humidity,
        windSpeed: weatherRes.data.wind.speed,
        pressure: weatherRes.data.main.pressure,
        condition: weatherRes.data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weatherRes.data.weather[0].icon}@2x.png`,
      });

      const dailyData = {};
      forecastRes.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });

        if (!dailyData[day]) {
          dailyData[day] = {
            day,
            temps: [],
            windSpeeds: [],
            humidities: [],
            pressures: [],
            conditions: new Set(),
            icons: new Set(),
          };
        }

        dailyData[day].temps.push(item.main.temp);
        dailyData[day].windSpeeds.push(item.wind.speed);
        dailyData[day].humidities.push(item.main.humidity);
        dailyData[day].pressures.push(item.main.pressure);
        dailyData[day].conditions.add(item.weather[0].description);
        dailyData[day].icons.add(
          `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
        );
      });

      const formattedForecast = Object.values(dailyData).map((day) => ({
        day: day.day,
        temp: Math.round(
          day.temps.reduce((sum, t) => sum + t, 0) / day.temps.length
        ),
        windSpeed: Math.round(
          day.windSpeeds.reduce((sum, w) => sum + w, 0) / day.windSpeeds.length
        ),
        humidity: Math.round(
          day.humidities.reduce((sum, h) => sum + h, 0) / day.humidities.length
        ),
        pressure: Math.round(
          day.pressures.reduce((sum, p) => sum + p, 0) / day.pressures.length
        ),
        condition: [...day.conditions].join(", "),
        icon: [...day.icons][0],
      }));

      setForecast(formattedForecast);

      // Save city details in storage
      await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(locationData));

      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("City not found or API issue.");
      setLoading(false);
    }
  };

  const updateCity = async (newCity) => {
    setCity(newCity);
    fetchWeather(newCity);
  };

  return (
    <WeatherContext.Provider value={{ weather, forecast, loading, city, location, updateCity, fetchWeather, error }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
