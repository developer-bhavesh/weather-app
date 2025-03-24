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
import { MotiView } from "moti";
import {
  FontAwesome
} from "@expo/vector-icons";

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
        <View className="my-5">
          <Text className="text-xl font-bold text-white mb-2">
            Default City
          </Text>
          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <Text className="text-2xl font-semibold text-yellow-300">
              {city || "Select a City"}
            </Text>
          </TouchableOpacity>
          {city && (
            <View className="mt-1">
              <Text className="text-lg text-white">
                {location?.state} {location?.country}
              </Text>
              <Text className="text-sm text-white">
                🌍 Lat: {location?.lat?.toFixed(2)}, Lon: {location?.lon?.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Search Input and Suggestions */}
        {searchVisible && (
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
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Settings;
