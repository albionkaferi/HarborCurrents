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
  const { units, maxScale } = useContext(SettingsContext);
  const [rows, setRows] = useState([]);
  let maxMeters = (maxScale*0.514444);

  useEffect(() => {
    const generateRows = () => {
      const newRows = [];
      if (units === "knots") {
        let increment = maxScale/10;
        for (let i = 0; i <= maxScale+ 0.0001; i += increment) {
          newRows.push(i.toFixed(2));
        }
      } else if (units === "m/s") {
        let increment = maxMeters/10;
        for (let i = 0; i <= maxMeters+ 0.0001; i += increment) {
          newRows.push(i.toFixed(2));
        }
      }
      setRows(newRows);
    };

    generateRows();
  }, [units, maxScale]);

  const getColorForValue = (value) => {
    let max = maxScale;
    if (units == "knots") {
      max = maxScale;
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
              parseFloat(row) === maxScale ? maxScale+"+" : row
            } knots`}</Text>
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
            {`${row}${index === rows.length - 1 ? "+ m/s" : " m/s"}`}
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
                parseFloat(row) === maxScale ? maxScale+"+" : row
              } knots`}</Text>
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
