import { SafeAreaView, StyleSheet, View } from "react-native";
import DateTimeSettings from "../components/DateTimeSettings";
import MapDisplay from "../components/MapDisplay";
import data from "../data/data.json";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.picker}>
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
    top: 50,
    alignSelf: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    flex: 1,
  },
});
