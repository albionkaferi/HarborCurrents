import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./screens/MapScreen";
import ChartScreen from "./screens/ChartScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "./contexts/AuthContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userToken != null ? (
        <Tab.Navigator
          initialRouteName="Map"
          screenOptions={{
            activeTintColor: "#e91e63",
            headerShown: false,
            tabBarStyle: { padding: 10, height: 100 },
            tabBarLabelStyle: { marginBottom: 10, fontSize: 12 },
          }}
        >
          <Tab.Screen
            name="Chart"
            component={ChartScreen}
            options={{
              tabBarLabel: "Chart",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "bar-chart" : "bar-chart-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarLabel: "Map",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "map" : "map-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: "Settings",
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen />
      )}
    </NavigationContainer>
  );
}
