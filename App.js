import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./screens/MapScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";

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
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data, setError) => {
        try {
          // ** REPLACE "localhost" with your IPv4 Address
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
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken != null ? (
          <Tab.Navigator>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Settings">
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
