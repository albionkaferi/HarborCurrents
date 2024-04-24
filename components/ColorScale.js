import { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SettingsContext } from "../contexts/SettingsContext";

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
  const { units, maxMag } = useContext(SettingsContext);
  const [rows, setRows] = useState([]);
  let maxMeters = maxMag * 0.514444;

  useEffect(() => {
    const generateRows = () => {
      const newRows = [];
      if (units === "knots") {
        let increment = maxMag / 10;
          newRows.push("Knots");
        for (let i = 0; i <= maxMag + 0.0001; i += increment) {
          newRows.push(i.toFixed(2));
        }
      } else if (units === "m/s") {
        let increment = maxMeters / 10;
        newRows.push("m/s");
        for (let i = 0; i <= maxMeters + 0.0001; i += increment) {
          newRows.push(i.toFixed(2));
        }
      }
      setRows(newRows);
    };

    generateRows();
  }, [units, maxMag]);

  const getColorForValue = (value) => {
    if (isNaN(value)) {
      return "hsl(0,100%,100%)"; // Return white for NaN or "knots"
  }
    let max = maxMag;
    if (units == "knots") {
      max = maxMag;
    } else if (units == "m/s") {
      max = maxMeters;
    }
    const min = 0.0;
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const hue = ((1 - normalizedValue) * 100).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  };

  if (!visible) {
    return null;
  }

  if (units == "knots") {
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
              parseFloat(row) === maxMag ? maxMag + "+" : row
            }`}</Text>
          </View>
        ))}
      </View>
    );
  } else if (units == "m/s") {
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
            <Text style={styles.rowText}>
              {`${row}${index === rows.length - 1 ? "+" : ""}`}
            </Text>
          </View>
        ))}
      </View>
    );
  } else {
    if (units == "knots") {
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
                parseFloat(row) === maxMag ? maxMag + "+" : row
              }`}</Text>
            </View>
          ))}
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 2,
    padding: 10,
    width: 75,
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
    top: 60,
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
