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
          {tableVisible ? "Hide Scale" : "Show Scale"}
        </Text>
      </TouchableOpacity>
      <ColorTable visible={tableVisible} />
    </>
  );
}

const ColorTable = ({ visible }) => {
  const getColorForValue = (value) => {
    const max = 1;
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
  for (let i = 0; i <= 1.1; i += 0.1) {
    rows.push((i).toFixed(2));
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
            parseFloat(row) === 1.1 ? "1.1+" : row
          } knots`}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 10,
    width: 105,
    maxHeight: "50%",
  },
  row: {
    paddingVertical: 0,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
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
    backgroundColor: "#007bff",
    width: 112,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
