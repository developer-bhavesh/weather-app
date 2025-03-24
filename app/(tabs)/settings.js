import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useWeather } from "../../context/WeatherProvider";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import Icon from "react-native-vector-icons/FontAwesome";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct";

const Settings = () => {
  const { city, updateCity, location } = useWeather();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

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
    <SafeAreaView className="flex-1 bg-gray-100">
      <LinearGradient colors={["#3a7bd5", "#3a6073"]} className="flex-1">
        <ScrollView className="p-6">
          {/* 🔹 Title */}
          <Text className="text-2xl font-bold text-white mb-4">Settings</Text>

          {/* 🔹 Default Location */}
          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <View className="flex-row items-center bg-white p-4 rounded-lg shadow mb-4">
              <Ionicons name="location-outline" size={28} color="#007aff" />
              <View className="ml-3">
                <Text className="text-[#007aff]">{city || "Select a City"}</Text>
                <Text className="text-lg text-[#007aff]">
                  {location.state} {location.country}
                </Text>
                <Text className="text-sm text-[#007aff]">
                  Lat: {location.lat?.toFixed(2)} Lon:{" "}
                  {location.lon?.toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 🔹 Search Modal */}
          <Modal
            visible={searchVisible}
            animationType="slide"
            transparent={true}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-11/12 shadow-lg">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Search City
                </Text>

                <TextInput
                  placeholder="Enter city name"
                  value={input}
                  onChangeText={(text) => {
                    setInput(text);
                    fetchSuggestions(text);
                  }}
                  className="border p-3 rounded-lg text-lg mb-3 bg-gray-100"
                />

                {/* 🔹 Suggestions List */}
                {suggestions.length > 0 && (
                  <BlurView
                    intensity={90}
                    tint="light"
                    className="rounded-lg overflow-hidden"
                  >
                    {suggestions.map((city, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => selectCity(city)}
                        className="p-3 border-b border-gray-200 flex-row items-center bg-white"
                      >
                        <Ionicons
                          name="location-outline"
                          size={24}
                          color="#007aff"
                        />
                        <View className="ml-3">
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
                )}

                {/* 🔹 Close Button */}
                <Button
                  title="Close"
                  onPress={() => setSearchVisible(false)}
                  color="#007aff"
                />
              </View>
            </View>
          </Modal>

          {/* 🔹 About Us */}
          <Text className="text-lg font-bold text-white mt-4 mb-2">About</Text>

          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-lg shadow mb-2"
            onPress={() => setAboutVisible(!aboutVisible)}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="black"
            />
            <Text className="ml-3 text-lg">About Us</Text>
          </TouchableOpacity>

          <AnimatePresence>
            {aboutVisible && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -10 }}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <Text className="text-gray-700 text-lg">
                  About 🌍📱{"\n\n"}Developed by Solanki Bhavesh, a passionate
                  React Native developer, this app is designed to provide fast,
                  accurate, and real-time weather updates. With a sleek UI and
                  smart search, stay informed about the weather anytime,
                  anywhere. Built for simplicity, efficiency, and a seamless
                  user experience. ☁️⚡🚀
                </Text>
              </MotiView>
            )}
          </AnimatePresence>

          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-lg shadow mb-2"
            onPress={() => setPrivacyVisible(!privacyVisible)}
          >
            <FontAwesome name="shield" size={24} color="black" />
            <Text className="ml-3 text-lg">Privacy Policy</Text>
          </TouchableOpacity>

          <AnimatePresence>
            {privacyVisible && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -10 }}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <Text className="text-gray-700 text-lg font-bold font-light">
                  "We respect your privacy and do not collect or store your
                  location data."
                </Text>

                {/* 🔹 Privacy Policy Button */}
                <TouchableOpacity
                  className="mt-4 bg-[#007aff] p-3 rounded-lg items-center"
                  onPress={() =>
                    Linking.openURL("https://your-privacy-policy-url.com")
                  }
                >
                  <Text className="text-white font-semibold">
                    Read Privacy Policy
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </AnimatePresence>

          {/* 🔹 Contact Us */}
          <Text className="text-lg font-bold text-white mt-4 mb-2">
            Support
          </Text>

          <TouchableOpacity
            className="flex-row items-center bg-white p-4 rounded-lg shadow mb-2"
            onPress={() => setContactVisible(!contactVisible)}
          >
            <MaterialIcons name="email" size={24} color="black" />
            <Text className="ml-3 text-lg">Contact Us</Text>
          </TouchableOpacity>
          <AnimatePresence>
            {contactVisible && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -10 }}
                className="bg-white p-4 rounded-lg shadow mb-4"
              >
                <Text className="text-gray-700 text-lg font-semibold">
                  Contact Us 📞
                </Text>
                <Text className="text-gray-600 text-base mt-2">
                  Developed by Solanki Bhavesh, a passionate React Native
                  developer.
                </Text>

                {/* 🔹 GitHub Button */}
                <TouchableOpacity
                  className="flex-row items-center mt-4 bg-gray-900 p-3 rounded-lg"
                  onPress={() =>
                    Linking.openURL("https://github.com/developer-bhavesh")
                  }
                >
                  <Icon name="github" size={20} color="white" />
                  <Text className="text-white ml-3 font-semibold">GitHub</Text>
                </TouchableOpacity>

                {/* 🔹 LinkedIn Button */}
                <TouchableOpacity
                  className="flex-row items-center mt-3 bg-blue-600 p-3 rounded-lg"
                  onPress={() =>
                    Linking.openURL(
                      "https://www.linkedin.com/in/bhavesh-solanki-165b632b3"
                    )
                  }
                >
                  <Icon name="linkedin" size={20} color="white" />
                  <Text className="text-white ml-3 font-semibold">
                    LinkedIn
                  </Text>
                </TouchableOpacity>

                {/* 🔹 Email Button */}
                <TouchableOpacity
                  className="flex-row items-center mt-3 bg-red-500 p-3 rounded-lg"
                  onPress={() =>
                    Linking.openURL("mailto:solankibhavesh1304@gmail.com")
                  }
                >
                  <Icon name="envelope" size={20} color="white" />
                  <Text className="text-white ml-3 font-semibold">Email</Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </AnimatePresence>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Settings;
