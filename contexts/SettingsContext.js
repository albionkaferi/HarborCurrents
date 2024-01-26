import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export default SettingsProvider = ({ children }) => {
  const [position, setPosition] = useState("top");
  const [units, setUnits] = useState("knots");
  const [model, setModel] = useState("model1");
  const [depth, setDepth] = useState("1");

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
      setPosition(newPosition);
      await AsyncStorage.setItem("position", newPosition);
    } catch (e) {
      console.error("Failed to update position.");
    }
  };

  const storeUnits = async (newUnits) => {
    try {
      setUnits(newUnits);
      await AsyncStorage.setItem("units", newUnits);
    } catch (e) {
      console.error("Failed to update units.");
    }
  };

  const storeModel = async (newModel) => {
    try {
      setModel(newModel);
      await AsyncStorage.setItem("model", newModel);
    } catch (e) {
      console.error("Failed to update model.");
    }
  };

  const storeDepth = async (newDepth) => {
    try {
      setDepth(newDepth);
      await AsyncStorage.setItem("depth", newDepth);
    } catch (e) {
      console.error("failed to update depth.");
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        position,
        storePosition,
        units,
        storeUnits,
        model,
        storeModel,
        depth,
        storeDepth,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
