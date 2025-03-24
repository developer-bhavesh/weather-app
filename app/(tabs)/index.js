import React from "react";
import { View, Text, SafeAreaView, Dimensions, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { MotiView } from "moti";
import LottieView from "lottie-react-native";
import WeatherDetailCard from "../../components/WeatherDetail";
import { useWeather } from "../../context/WeatherProvider";
import WeatherMarquee from "../../components/WeatherMarquee";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { RFPercentage } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const weatherAnimations = {
  Clear: require("../../assets/animations/sunny.json"),
  Rain: require("../../assets/animations/rainy.json"),
  Clouds: require("../../assets/animations/cloudy.json"),
  Thunderstorm: require("../../assets/animations/thunder.json"),
  Snow: require("../../assets/animations/snow.json"),
};

const weatherGradients = {
  Clear: ["#3a7bd5", "#3a6073"],
  Rain: ["#3a7bd5", "#3a6073"],
  Clouds: ["#757F9A", "#D7DDE8"],
  Thunderstorm: ["#141E30", "#243B55"],
  Snow: ["#83a4d4", "#b6fbff"],
};

const Home = () => {
  const { colorScheme } = useColorScheme();
  const { forecast,weather, loading, city,location } = useWeather();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-600 dark:bg-gray-900">
        <Text className="text-white text-lg">Loading weather data...</Text>
      </View>
    );
  }

  const weatherCondition = weather?.condition || "Clear";
  const animationSource = weatherAnimations[weatherCondition] || weatherAnimations["Clear"];
  const gradientColors = weatherGradients[weatherCondition] || weatherGradients["Clear"];

  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient colors={gradientColors} className="absolute w-full h-full">

      {/* Scrollable Content */}

        <BlurView intensity={50} className="flex-1 px-4 pt-6">
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 80, delay: 200 }}
            className="items-center"
          >
            {/* Weather Animation */}
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={{ width: width * 0.5, height: width * 0.5 }}
            />

            {/* Temperature and Condition */}
            <Text className="text-white font-extrabold mt-2" style={{ fontSize: RFPercentage(6), textAlign: "center" }}>
              {weather?.temp ? `${weather.temp}°C` : "--°C"}
            </Text>
            <Text className="text-white font-semibold" style={{ fontSize: RFPercentage(3), textAlign: "center" }}>
              {weather?.condition || "Unknown"}
            </Text>
            <Text className="text-white font-medium mt-2" style={{ fontSize: RFPercentage(2.5), textAlign: "center" }}>
              {city ? `${city}, ${location?.state} ${location?.country}` : "Location Unknown"}
            </Text>
          </MotiView>

          {/* Weather Details Section */}
          <View 
            className="flex-row justify-between mt-2  py-4"
            style={{ gap: width * 0.02 }}
          >
            <WeatherDetailCard
              title="Humidity"
              value={weather?.humidity ? `${weather.humidity} %` : "--%"}
              icon={require("../../assets/animations/humidity.json")}
              style={{ flex: 1, minWidth: width * 0.3, maxWidth: width * 0.33 }}
            />
            <WeatherDetailCard
              title="Wind Speed"
              value={weather?.windSpeed ? `${weather.windSpeed} km/h` : "-- km/h"}
              icon={require("../../assets/animations/windspeed.json")}
              style={{ flex: 1, minWidth: width * 0.3, maxWidth: width * 0.33 }}
            />
            <WeatherDetailCard
              title="Pressure"
              value={weather?.pressure ? `${weather.pressure} hPa` : "-- hPa"}
              icon={require("../../assets/animations/pressure.json")}
              style={{ flex: 1, minWidth: width * 0.3, maxWidth: width * 0.33 }}
            />
          </View>

          {/* 5-Day Forecast Marquee */}
          <View className="w-full">
            <Text className="text-white font-medium mt-2" style={{ fontSize: RFPercentage(2.5), textAlign: "center" }}>Weather this Week</Text>
            <WeatherMarquee forecastData={forecast} loading={loading}/>
          </View>
        </BlurView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;
