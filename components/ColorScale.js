import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ColorScale() {
  const [tableVisible, setTableVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setTableVisible(!tableVisible)}
      >
        <Text style={styles.buttonText}>
          {tableVisible ? "Hide Table" : "Show Table"}
        </Text>
      </TouchableOpacity>
      <ColorTable visible={tableVisible} />
    </>
  );
}

const ColorTable = ({ visible }) => {
  const getColorForValue = (value) => {
    const max = 0.55;
    const min = 0.0;
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const hue = ((1 - normalizedValue) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  };

  if (!visible) {
    return null;
  }

  // Generate row values ranging from 0.00 to 0.55 in increments of 0.05
  const rows = [];
  for (let i = 0; i <= 0.55; i += 0.05) {
    rows.push(i.toFixed(2));
  }

  return (
    <View style={styles.table}>
      {rows.map((row, index) => (
        <View
          key={index}
          style={[
            styles.row,
            { backgroundColor: getColorForValue(parseFloat(row)) },
          ]}
        >
          <Text style={styles.rowText}>{`${
            parseFloat(row) === 0.55 ? "0.55+" : row
          } m/s`}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    zIndex: 2, // Ensure it's above the WebView
    padding: 10,
    width: 100, // Set explicit width
    maxHeight: "50%", // Set max height to prevent covering the WebView
  },
  row: {
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2, // Add border width
    borderColor: "black", // Add border color
  },
  rowText: {
    fontSize: 12,
    color: "black",
  },
  button: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
});
