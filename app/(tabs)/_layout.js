import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Animated, Platform } from "react-native";
import { useColorScheme } from "nativewind";

const TabLayout = () => {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1E1E1E" : "#FFFFFF",
          height: 40,
          borderTopWidth: 0,
          paddingBottom: 10,
          ...Platform.select({
            android: {
              elevation: 5,
            },
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: (props) => <CustomTabButton {...props} icon="home" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarButton: (props) => <CustomTabButton {...props} icon="search" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarButton: (props) => <CustomTabButton {...props} icon="gear" />,
        }}
      />
    </Tabs>
  );
};

const CustomTabButton = ({ icon, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: focused ? -5 : 0,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Pressable
      className="flex-1 items-center justify-center"
      onPress={onPress}
    >
      <Animated.View
        className="w-14 h-14 flex items-center justify-center rounded-2xl"
        style={{
          backgroundColor: focused ? "#3B82F6" : "#fff",
          transform: [{ translateY }],
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
          }),
        }}
      >
        <FontAwesome name={icon} size={28} color={focused ? "white" : "#555"} />
      </Animated.View>
    </Pressable>
  );
};

export default TabLayout;
