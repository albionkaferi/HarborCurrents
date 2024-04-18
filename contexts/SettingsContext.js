import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export default SettingsProvider = ({ children }) => {
  const [units, setUnits] = useState("knots");
  const [depth, setDepth] = useState("1");
  const [model, setModel] = useState("bergen");
  const [maxMag, setMaxMag] = useState(2.5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const keys = ["units", "depth", "model", "maxMag"];
        const setters = [setUnits, setDepth, setModel, setMaxMag];

        for (let i = 0; i < keys.length; i++) {
          const storedValue = await AsyncStorage.getItem(keys[i]);
          if (storedValue !== null) {
            if (keys[i] == "maxMag") {
              const numberValue = Number(storedValue);
              setters[i](numberValue);
            } else {
              setters[i](storedValue);
            }
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
      maxMag: setMaxMag,
    };
    try {
      setters[key](newValue);
      await AsyncStorage.setItem(key, newValue.toString());
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
        maxMag,
        storeItem,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
