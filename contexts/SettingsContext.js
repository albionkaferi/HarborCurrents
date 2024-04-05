import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export default SettingsProvider = ({ children }) => {
  const [units, setUnits] = useState("knots");
  const [depth, setDepth] = useState("1");
  const [model, setModel] = useState("bergen");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const keys = ["units", "depth", "model"];
        const setters = [setUnits, setDepth, setModel];

        for (let i = 0; i < keys.length; i++) {
          const storedValue = await AsyncStorage.getItem(keys[i]);
          if (storedValue !== null) {
            setters[i](storedValue);
          }
        }
      } catch (e) {
        console.error("Failed to fetch settings.");
      }
    };

    fetchSettings();
  }, []);

  const storeItem = async (key, newValue) => {
    const setters = {
      units: setUnits,
      depth: setDepth,
      model: setModel,
    };
    try {
      setters[key](newValue);
      await AsyncStorage.setItem(key, newValue);
    } catch (e) {
      console.log(`Failed to update ${key}.`);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        units,
        model,
        depth,
        storeItem,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
