import AuthProvider from "./contexts/AuthContext";
import SettingsProvider from "./contexts/SettingsContext";
import AppNavigator from "./AppNavigator";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SettingsProvider>
    </AuthProvider>
  );
}
