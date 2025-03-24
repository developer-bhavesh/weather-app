import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import CityImageSlider from "../../components/CityImageSlider";
import {
  FontAwesome
} from "@expo/vector-icons";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";

const { width } = Dimensions.get("window");

const SearchWeather = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [visible, setvisible] = useState(false);

  const fetchSuggestions = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${GEO_API_URL}?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setSuggestions(data);
      }
    } catch (err) {
      setSuggestions([]);
    }
  };

  const fetchWeather = async (city) => {
    try {
      setError(null);
      setSuggestions([]);
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (response.ok) {
        setWeather({
          city: data.name,
          temp: data.main.temp,
          condition: data.weather[0].description,
        });

        fetchForecast(city);
      } else {
        setError(data.message || "City not found");
        setWeather(null);
        setForecast([]);
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      setWeather(null);
      setForecast([]);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (response.ok) {
        const dailyForecast = {};
        data.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
          const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

          if (!dailyForecast[dayKey]) {
            dailyForecast[dayKey] = {
              date: dayName,
              temp: item.main.temp,
              condition: item.weather[0].description,
              windSpeed: item.wind.speed,
              humidity: item.main.humidity,
              pressure: item.main.pressure,
            };
          }
        });

        setForecast(Object.values(dailyForecast).slice(0, 5)); // First 5 days
      } else {
        setForecast([]);
      }
    } catch (err) {
      setForecast([]);
    }
  };

  const handleSearch = () => {
    if (input.trim() !== "") {
      fetchWeather(input);
    }
  };

  const selectCity = (cityName) => {
    setInput(cityName);
    fetchWeather(cityName);
    setvisible(true);
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear sky":
        return require("../../assets/weather/clear.png");
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return require("../../assets/weather/cloudy.png");
      case "shower rain":
      case "light rain":
      case "rain":
        return require("../../assets/weather/rain.png");
      case "thunderstorm":
        return require("../../assets/weather/storm.png");
      case "snow":
        return require("../../assets/weather/snow.png");
      default:
        return require("../../assets/weather/default.png");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#3a7bd5", "#3a6073"]}
        style={{ flex: 1, padding: 20 }}
        className="absolute w-full h-full"
      >
        {/* Search Box */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 80 }}
          className="p-4 mt-10 h-auto bg-transparent rounded-xl"
        >
          <View className="flex-row items-center border p-1 rounded-lg bg-white shadow-sm">
            <TextInput
              placeholder="Enter city name"
              value={input}
              onChangeText={(text) => {
                setInput(text);
                fetchSuggestions(text);
                if (text.length === 0) {
                  setvisible(false);
                }
              }}
              className="flex-1 text-lg"
            />
            <TouchableOpacity
              onPress={handleSearch}
              className="p-2  rounded-lg"
            >
              <FontAwesome name="search" className="" />
            </TouchableOpacity>
          </View>

          {/* City Suggestions */}
          {suggestions.length > 0 && (
            <View className="absolute top-16 left-0 right-0 z-10">
              <BlurView
                intensity={90}
                tint="light"
                className="rounded-lg mx-4 overflow-hidden"
              >
                {suggestions.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectCity(city.name, city.lat, city.lon)}
                    className="p-3 border-b border-gray-200 flex-row items-center"
                  >
                    {/* Location Icon */}
                    <Image
                      source={{
                        uri: "https://img.icons8.com/ios/50/marker.png",
                      }}
                      className="w-6 h-6 mr-3 opacity-60"
                    />

                    {/* City Info */}
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {city.name}, {city.country}
                      </Text>
                      {city.state && (
                        <Text className="text-sm text-gray-500">
                          {city.state}
                        </Text>
                      )}
                      <Text className="text-sm text-gray-500">
                        🌍 Lat: {city.lat.toFixed(2)}, Lon:{" "}
                        {city.lon.toFixed(2)}
                      </Text>
                    </View>

                    {/* Temperature (Dynamically Fetched) */}
                    {city.temp && (
                      <Text className="text-lg font-semibold text-blue-600">
                        {city.temp}°C
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </BlurView>
            </View>
          )}
        </MotiView>

        {/* Error Message */}
        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}

        {/* Current Weather Display */}
        {visible === true && (
          <View>
            <CityImageSlider city={input} />
            <View className="w-full rounded-lg mt-4">
      {weather && (
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 80,
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            width: width - 32,
          }}
        >
          <BlurView
            intensity={90}
            tint="light"
            style={{
              borderRadius: 8,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "space-evenly",
              paddingVertical: 10,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              width: width - 32, // Full width
            }}
          >
            

            <Animated.View
              entering={FadeInUp.delay(100).duration(500)}
              className="dark:bg-gray-800 p-3 mx-2 rounded-lg items-center w-full"
            >
              <Text className="text-xl font-bold">Weather in {weather.city}</Text>
              <Text className="text-lg">Temperature: {weather.temp}°C</Text>
              <Text className="text-lg">Condition: {weather.condition}</Text>
            </Animated.View>
          </BlurView>
        </MotiView>
      )}
    </View>

            {/* Weather Forecast Section */}
            <View className="w-full p-3 rounded-lg mt-4">
              {forecast.length === 0 ? (
                <Text className="text-center text-sm text-red-500">
                  ⚠️ No data available!
                </Text>
              ) : (
                <FlatList
                  data={forecast}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <MotiView
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        damping: 10,
                        stiffness: 80,
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        padding: 2
                      }}
                    >
                      <BlurView
                        intensity={90}
                        tint="light"
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          paddingVertical: 10,
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >


                        <Animated.View
                          entering={FadeInUp.delay(index * 100).duration(500)}
                          className=" dark:bg-gray-800 p-3 mx-2 rounded-lg items-center w-40"
                        >
                          <Text className="text-gray-700 dark:text-white text-xs font-semibold">
                            {item.day}
                          </Text>

                          <Image
                            source={getWeatherIcon(item.condition)}
                            className="w-20 h-20 my-3"
                          />

                          <Text className="text-blue-500 dark:text-blue-300 text-xl font-bold">
                            {item.temp}°C
                          </Text>

                          <Text className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                            {item.condition}
                          </Text>
                          <View className="mt-2">
                            <Text className="text-gray-600 dark:text-gray-300 text-sm">
                              💨 {item.windSpeed} km/h
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-300 text-sm">
                              💧 {item.humidity}%
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-300 text-sm">
                              🌡️ {item.pressure} hPa
                            </Text>
                          </View>
                        </Animated.View>
                      </BlurView>
                    </MotiView>
                  )}
                />
              )}
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SearchWeather;
