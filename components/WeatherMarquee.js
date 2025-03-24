import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

const WeatherMarquee = ({ forecastData, loading }) => {
  const limitedForecast = forecastData?.slice(1, 6) || [];

  return (
    <View className="w-full dark:bg-gray-900 p-3 rounded-lg">
      {loading ? (
        <Text className="text-center text-sm text-white">Loading...</Text>
      ) : limitedForecast.length === 0 ? (
        <Text className="text-center text-sm text-red-500">
          ⚠️ No data available!
        </Text>
      ) : (
        <FlatList
          data={limitedForecast}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 80 }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 8,
                borderRadius: 8
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
                <LinearGradient
                  colors={["rgba(79,172,254,0.8)", "rgba(0,242,254,0.8)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    position: "absolute",
                    borderRadius: 20,
                    padding: 3,
                  }}
                />

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
  );
};

const getWeatherIcon = (condition) => {
  if (!condition || typeof condition !== "string") {
    return require("../assets/weather/clear.png"); 
  }

  switch (condition.toLowerCase()) {
    case "clear sky":
      return require("../assets/weather/clear.png");
    case "few clouds":
      return require("../assets/weather/cloudy.png");
    case "scattered clouds":
    case "broken clouds":
      return require("../assets/weather/partly_cloudy.png");
    case "shower rain":
    case "rain":
      return require("../assets/weather/rain.png");
    case "light rain":
      return require("../assets/weather/rain.png");
    case "thunderstorm":
      return require("../assets/weather/storm.png");
    case "snow":
      return require("../assets/weather/snow.png");
    default:
      return require("../assets/weather/default.png");
  }
};


export default WeatherMarquee;
