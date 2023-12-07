import AuthProvider from "./contexts/AuthContext";
import SettingsProvider from "./contexts/SettingsContext";
import AppNavigator from "./AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </AuthProvider>
  );
}
