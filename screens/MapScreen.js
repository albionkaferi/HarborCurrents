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
import { getRoundedDate } from "../lib/utils";

export default function App() {
  const [date, setDate] = useState(getRoundedDate());
  const { units, depth, model, maxMag } = useContext(SettingsContext);
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

  useEffect(() => {
    webviewRef.current.postMessage({
      maxMag: maxMag,
    });
  }, [maxMag]);

  function sendDataToWebView() {
    webviewRef.current.postMessage({
      token: userToken,
      time: toLocalISOString(date),
      depth: depth,
      model: model,
      units: units,
      maxMag: maxMag,
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
