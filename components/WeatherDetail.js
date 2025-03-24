import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = width * 0.3;

const WeatherDetailCard = ({ title, value, icon }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 10, stiffness: 80 }}
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer Gradient Glow Effect */}
      <LinearGradient
        colors={["rgba(79,172,254,0.8)", "rgba(0,242,254,0.8)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          borderRadius: 20,
          padding: 3,
          width: CARD_SIZE,
          height: CARD_SIZE,
        }}
      />

      {/* Glassmorphic Card */}
      <BlurView 
        intensity={90} 
        tint="light" 
        style={{ 
          borderRadius: 20, 
          overflow: "hidden", 
          width: CARD_SIZE, 
          height: CARD_SIZE, 
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingVertical: 10,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Weather Icon (No Color Change) */}
        <LottieView
                      source={icon}
                      autoPlay
                      loop
                      style={{ width: CARD_SIZE * 0.6, height: CARD_SIZE* 0.6,marginBottom:-8 }}
                    />
        

        {/* Title */}
        <Text 
          style={{
            color: "#007aff",
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        {/* Value */}
        <Text 
          style={{
            color: "#007AFF",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {value}
        </Text>
      </BlurView>
    </MotiView>
  );
};

export default WeatherDetailCard;
