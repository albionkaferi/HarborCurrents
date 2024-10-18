import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useContext, useState, useCallback } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { SettingsContext } from "../contexts/SettingsContext";
import { AuthContext } from "../contexts/AuthContext";
import { debounce } from "../lib/utils";

export default function SettingsScreen() {
  const { signOut } = useContext(AuthContext);

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
            <SelectorButton title="Bergen Point" value="bergen" type="model" />
            <SelectorButton title="Regional" value="nyhops" type="model" />
          </View>
        </View>
      </View>
      <SliderSetting />

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
    : {
        borderWidth: 2,
        borderColor: "rgba(158, 150, 150, .5)",
      };

  const textStyle = isSelected
    ? styles.optionText
    : [styles.optionText, { color: "#3f3f46" }];

  return (
    <Pressable
      style={[styles.option, selectedButtonStyle]}
      onPress={() => storeItem(type, value)}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const SliderSetting = () => {
  const { maxMag, storeItem } = useContext(SettingsContext);
  const { units } = useContext(SettingsContext);
  const [tempMaxMag, setTempMaxMag] = useState(maxMag);

  const debouncedStoreItem = useCallback(
    debounce((newValue) => storeItem("maxMag", newValue), 500),
    []
  );

  return (
    <View style={styles.setting}>
      <Text style={styles.label}>Max Magnitude for Color Scale</Text>
      <Text style={styles.sliderValue}>
        {units === "knots" ? (tempMaxMag / 0.514444).toFixed(2) : tempMaxMag}{" "}
        {units}
      </Text>
      <Slider
        minimumValue={0.1}
        maximumValue={1.5}
        step={0.05}
        value={tempMaxMag}
        onValueChange={(value) => {
          const roundedValue = +value[0].toFixed(1);
          setTempMaxMag(roundedValue);
          debouncedStoreItem(roundedValue);
        }}
      />
    </View>
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
    width: "48%",
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 10,
  },
  optionText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  sliderValue: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
    color: "#191919",
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
