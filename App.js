import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./screens/MapScreen";
import ChartScreen from "./screens/ChartScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const AuthContext = React.createContext();
const Tab = createBottomTabNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      // try {
      //   userToken = await SecureStore.getItemAsync("userToken");
      // } catch (e) {
      //   console.log(e);
      // }

      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data, setError) => {
        try {
          // ** REPLACE "localhost" with your private IPv4 Address
          const response = await fetch("http://localhost:8080/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (response.status == 200) {
            dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
          } else {
            setError("Invalid Credentials");
          }
        } catch (e) {
          console.log(e);
        }
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken != null ? (
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
            >
              {() => <SettingsScreen AuthContext={AuthContext} />}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
          <LoginScreen AuthContext={AuthContext} />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
