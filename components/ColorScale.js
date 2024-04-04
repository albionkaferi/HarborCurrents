import { useState, useEffect, useContext} from "react";
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
  const { units } = useContext(SettingsContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const generateRows = () => {
      const newRows = [];
      if (units === "knots") {
        for (let i = 0; i <= 2.5; i += 0.25) {
          newRows.push((i).toFixed(2));
        }
      } else if (units === "m/s") {
        for (let i = 0; i <= 0.55; i += 0.05) {
          newRows.push((i).toFixed(2));
        }
      }
      setRows(newRows);
    };

    generateRows();
  }, [units]);

  const getColorForValue = (value) => {
    let max = 2.5;
    if (units == "knots"){
      max = 2.5;
    } 
    else if (units == "m/s"){
      max = 0.55;
    } 
    const min = 0.0;
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const hue = ((1 - normalizedValue) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  };

  if (!visible) {
    return null;
  }

  if(units == "knots"){
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
              parseFloat(row) === 2.5 ? "2.5+" : row
            } knots`}</Text>
          </View>
        ))}
      </View>
    );
  }
  else if(units == "m/s"){
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
  }
  else{
    if(units == "knots"){
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
                parseFloat(row) === 2.5 ? "2.5+" : row
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
