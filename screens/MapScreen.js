import { StatusBar, StyleSheet, View, Text } from "react-native";
import DateTimeSettings from "../components/DateTimeSettings";
import MapDisplay from "../components/MapDisplay";
import { SettingsContext } from "../contexts/SettingsContext";
import { useState, useEffect, useContext } from "react";
import initialData from "../data/data.json";

export default function MapScreen() {
  const [data, setData] = useState(initialData);

  const { position } = useContext(SettingsContext);
  const positionStyle = position === "top" ? { top: 50 } : { bottom: 40 };

  useEffect(() => {
    const getData = async () => {
      // replace localhost with actual ipv4 address
      const response = await fetch(
        "http://192.168.1.6:8080/data?time=2023-11-14%2002:40&depth=1"
      );
      const currents = await response.json();
      setData(currents.data);
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.picker, positionStyle]}>
        <DateTimeSettings />
      </View>
      <View style={styles.map}>
        <MapDisplay data={data} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    flex: 1,
  },
});
