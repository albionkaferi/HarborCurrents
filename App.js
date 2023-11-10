import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "./screens/MapScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";

// const Tab = createBottomTabNavigator();

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   if (!isLoggedIn) {
//     return <LoginScreen setIsLoggedIn={setIsLoggedIn} />;
//   }

//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Map" component={MapScreen} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Settings">
            {() => <SettingsScreen logout={logout} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <LoginScreen login={login} />
      )}
    </NavigationContainer>
  );
}
