import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export default SettingsProvider = ({ children }) => {
  const [position, setPosition] = useState("top");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedPosition = await AsyncStorage.getItem("position");
        if (storedPosition !== null) {
          setPosition(storedPosition);
        }
      } catch (e) {
        console.error("Failed to fetch settings.");
      }
    };

    fetchSettings();
  }, []);

  const storePosition = async (newPosition) => {
    try {
      await AsyncStorage.setItem("position", newPosition);
      setPosition(newPosition);
    } catch (e) {
      console.error("Failed to update position.");
    }
  };

  return (
    <SettingsContext.Provider value={{ position, storePosition }}>
      {children}
    </SettingsContext.Provider>
  );
};
