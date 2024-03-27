import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import ColorScale from "../components/ColorScale";

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ uri: "https://harbor-currents-mapbox-website.vercel.app/" }}
      />
      <ColorScale />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});
