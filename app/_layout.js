import { StyleSheet, Text, View } from "react-native";
import React from "react";
import "../global.css";
import { Stack } from "expo-router";
import { WeatherProvider } from "../context/WeatherProvider";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  return (
  <>
    <WeatherProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </WeatherProvider>
    <StatusBar/>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
