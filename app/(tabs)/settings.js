import React, { useState, useContext } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useWeather } from "../../context/WeatherProvider";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";

const Settings = () => {
  const { city, updateCity,location } = useWeather();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);

  console.log(city)

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

  const selectCity = (city) => {
    updateCity(city?.name);
    setSearchVisible(false);
    setInput("");
    setSuggestions([]);
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={["#3a7bd5", "#3a6073"]} className="flex-1 p-6">
        {/* Default City Display */}
        <TouchableOpacity onPress={() => setSearchVisible(true)}>
        <View className="my-5 bg-white p-4 border-blue-700 rounded-xl">
          <View className="flex-row">
          <Ionicons name="location-outline" size={28}/>
          <Text className="text-xl font-bold text-black mb-2 items-center justify-center">
            Default Location
          </Text>
          </View>
          
            <Text className="text-2xl font-semibold text-[#007aff]">
              {city || "Select a City"}
            </Text>
          
          {city && (
            <View className="mt-1">
              <Text className="text-lg text-[#007aff]">
                {location.state} {location.country}
              </Text>
              <Text className="text-sm text-[#007aff]">
                Lat: {location.lat?.toFixed(2)} Lon: {location.lon?.toFixed(2)}
              </Text>
            </View>
          )}
        </View>
        </TouchableOpacity>

        {/* Search Input and Suggestions */}
        {searchVisible && (
          <View className="p-4 mt-4">
            <TextInput
              placeholder="Enter city name"
              value={input}
              onChangeText={(text) => {
                setInput(text);
                fetchSuggestions(text);
              }}
              className="border p-2 rounded-lg text-lg mb-3"
            />

            {/* Suggestions */}
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
                      onPress={() => selectCity(city)}
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
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </View>
            )}

            <Button title="Close" onPress={() => setSearchVisible(false)} />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Settings;