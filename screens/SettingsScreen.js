import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useContext } from "react";
import {Slider} from '@miblanchard/react-native-slider';
import { SettingsContext } from "../contexts/SettingsContext";
import { AuthContext } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const { signOut } = useContext(AuthContext);
  const { maxScale, setMaxScale } = useContext(SettingsContext);

  const handleSliderChange = (value) => {
    setMaxScale(roundToDecimal(value, 1)); // Update maxScale when slider value changes
  };

  const roundToDecimal = (num, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsContainer}>
        <Text style={styles.header}>Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.label}>Units</Text>
          <View style={styles.optionsContainer}>
            <SelectorButton title="Knots" value="knots" type="units" />
            <SelectorButton title="m/s" value="m/s" type="units" />
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.label}>Depth</Text>
          <View style={styles.optionsContainer}>
            <SelectorButton title="Surface" value="1" type="depth" />
            <SelectorButton title="Mid-level" value="5" type="depth" />
          </View>
        </View>
        <View style={styles.setting}>
          <Text style={styles.label}>Model</Text>
          <View style={styles.optionsContainer}>
            <SelectorButton title="Bergen Points" value="bergen" type="model" />
            <SelectorButton title="Regional" value="nyhops" type="model" />
          </View>
        </View>
        <View style={styles.setting}>
        <Text style={styles.label}>Set Max Value for Color Scale</Text>
          <Slider
            minimumValue={1}
            maximumValue={5}
            step={0.1}
            value={maxScale}
            onValueChange={handleSliderChange}
          />
          <Text>Value: {roundToDecimal(maxScale, 1)} knots</Text>
          <Text>Value: {roundToDecimal(maxScale*0.514444, 2)} m/s</Text>
        </View>
      </View>
      
      <Pressable
        onPress={signOut}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#7dd3fc" : "#0ea5e9" },
          styles.signOutBtn,
        ]}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const SelectorButton = ({ title, value, type }) => {
  const { units, model, depth, storeItem } = useContext(SettingsContext);

  const map = { units, model, depth };
  const selectedValue = map[type];
  const isSelected = value === selectedValue;
  const selectedButtonStyle = isSelected
    ? { borderWidth: 2, borderColor: "#007bff" }
    : { borderWidth: 2, borderColor: "borderColor: 'rgba(158, 150, 150, .5)'" };

  return (
    <Pressable
      style={[styles.option, selectedButtonStyle]}
      onPress={() => storeItem(type, value)}
    >
      <Text style={styles.optionText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsContainer: {
    marginTop: 36,
    width: "100%",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#191919",
    paddingLeft: 32,
    marginBottom: 48,
  },
  setting: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 32,
    marginBottom: 28,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#191919",
  },
  optionsContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    width: 148,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 10,
  },
  optionText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  signOutBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 48,
  },
  signOutText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
});
