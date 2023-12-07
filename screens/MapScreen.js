import { StatusBar, StyleSheet, View } from "react-native";
import DateTimeSettings from "../components/DateTimeSettings";
import MapDisplay from "../components/MapDisplay";
import data from "../data/data.json";
import { SettingsContext } from "../contexts/SettingsContext";
import { useContext } from "react";

export default function MapScreen() {
  const { position } = useContext(SettingsContext);
  const positionStyle = position === "top" ? { top: 50 } : { bottom: 40 };

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
