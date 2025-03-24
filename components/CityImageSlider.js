import { useState, useEffect, useCallback, useRef } from "react";
import { View, ActivityIndicator, Dimensions, Text, FlatList } from "react-native";
import { Image } from "expo-image";

const PEXELS_API_KEY = "A1hMzRnGuCV3MRlyJ3IRBI4xBsjqCcrQ7Mr0fAGjrEDYj2puANAOdj5W";
const { width, height } = Dimensions.get("window");

export default function CityImageSlider({ city }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);
  const direction = useRef(1); // 1 for forward, -1 for backward

  const fetchCityImages = useCallback(async () => {
    if (!city || !PEXELS_API_KEY) return;

    setLoading(true);
    setImages([]);

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(city)}&per_page=10`,
        {
          headers: { Authorization: PEXELS_API_KEY },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setImages(data.photos?.map((photo) => photo.src.landscape) || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchCityImages();
  }, [fetchCityImages]);

  // Auto-scrolling with forward & backward motion
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        if (flatListRef.current) {
          if (currentIndex.current === images.length - 1) {
            direction.current = -1; // Reverse direction
          } else if (currentIndex.current === 0) {
            direction.current = 1; // Forward direction
          }

          currentIndex.current += direction.current;

          flatListRef.current.scrollToIndex({ index: currentIndex.current, animated: true });
        }
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <View className="flex items-center justify-center w-full">
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : images.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{
                width: width * 0.9,
                height: height * 0.25,
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                resizeMode:"contain"
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}
        />
      ) : (
        <Text className="text-lg text-white mt-4">{city}</Text>
      )}
    </View>
  );
}
