import { useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  Pressable,
} from "react-native";
import { SettingsContext } from "../contexts/SettingsContext";
import { AuthContext } from "../contexts/AuthContext";

const SelectorButton = ({
  title,
  value,
  selectedValue,
  setSelectedValue,
  last = false,
}) => {
  const isSelected = value === selectedValue;
  const selectedButtonStyle = isSelected ? { backgroundColor: "#a3a3a3" } : {};
  const selectedTextStyle = isSelected ? { color: "#f5f5f5" } : {};
  const lastButtonStyle = last
    ? { borderTopRightRadius: 6, borderBottomRightRadius: 6 }
    : {};

  return (
    <Pressable
      style={[styles.btn, selectedButtonStyle, lastButtonStyle]}
      onPress={() => setSelectedValue(value)}
    >
      <Text style={[styles.text, selectedTextStyle]}>{title}</Text>
    </Pressable>
  );
};

export default function SettingsScreen() {
  const { signOut } = useContext(AuthContext);
  const { position, storePosition } = useContext(SettingsContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.setting}>
        <Text style={[styles.text, { paddingLeft: 12 }]}>
          DateTime Selector
        </Text>
        <View style={styles.btnContainer}>
          <SelectorButton
            title="Top"
            value="top"
            selectedValue={position}
            setSelectedValue={storePosition}
          />
          <SelectorButton
            title="Bottom"
            value="bottom"
            selectedValue={position}
            setSelectedValue={storePosition}
            last={true}
          />
        </View>
      </View>
      <Pressable onPress={signOut} style={styles.signOutBtn}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  setting: {
    backgroundColor: "#d4d4d4",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    width: "90%",
  },
  text: {
    fontSize: 18,
    paddingVertical: 8,
    color: "#404040",
  },
  btnContainer: {
    flexDirection: "row",
  },
  btn: {
    width: 80,
    borderLeftWidth: 1,
    borderLeftColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutBtn: {
    position: "absolute",
    bottom: 40,
    borderWidth: 2,
    borderColor: "#a3a3a3",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signOutText: {
    fontSize: 18,
    color: "#404040",
  },
});
