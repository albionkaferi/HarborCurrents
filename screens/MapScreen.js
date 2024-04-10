import { useState, useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View, Button } from "react-native";
import Constants from "expo-constants";
import ColorScale from "../components/ColorScale";
import DateTimeSettings from "../components/DateTimeSettings";
import { toLocalISOString } from "../lib/utils";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SettingsContext } from "../contexts/SettingsContext";

export default function App() {
  const [date, setDate] = useState(new Date());
  const { units, depth, model } = useContext(SettingsContext);
  const { userToken } = useContext(AuthContext);
  const webviewRef = useRef();

  useEffect(() => {
    webviewRef.current.postMessage({
      token: userToken,
      time: toLocalISOString(date),
      depth: depth,
      model: model,
    });
  }, [date, depth, model]);

  useEffect(() => {
    webviewRef.current.postMessage({
      units: units,
    });
  }, [units]);

  function sendDataToWebView() {
    webviewRef.current.postMessage({
      token: userToken,
      time: toLocalISOString(date),
      depth: depth,
      model: model,
      units: units,
      max_mag: 0.5
    });
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={{ uri: "https://harbor-currents-mapbox-website.vercel.app/" }}
        onLoad={async () => {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          sendDataToWebView();
        }}
      />
      <ColorScale />
      <DateTimeSettings date={date} setDate={setDate} />
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
