import { useState, useEffect, useRef, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import ColorScale from "../components/ColorScale";
import DateTimeSettings from "../components/DateTimeSettings";
import { AuthContext } from "../contexts/AuthContext";
import { SettingsContext } from "../contexts/SettingsContext";
import { toLocalISOString, getRoundedDate } from "../lib/utils";

export default function App() {
  const [date, setDate] = useState(getRoundedDate());
  const { units, depth, model, maxMag } = useContext(SettingsContext);
  const { userToken } = useContext(AuthContext);
  const webviewRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      webviewRef.current.postMessage({
        token: userToken,
        time: toLocalISOString(date),
        depth: depth,
        model: model,
      });
    }
  }, [date, depth, model]);

  useEffect(() => {
    if (isReady) {
      webviewRef.current.postMessage({
        units: units,
      });
    }
  }, [units]);

  useEffect(() => {
    if (isReady) {
      webviewRef.current.postMessage({
        maxMag: maxMag,
      });
    }
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
        onMessage={async (event) => {
          sendDataToWebView();
          setIsReady(true);
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          webviewRef && webviewRef.current.reload();
        }}
      >
        <Text style={styles.buttonText}>Reload Map</Text>
      </TouchableOpacity>
      <ColorScale />
      <DateTimeSettings date={date} setDate={setDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  webview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    top: 70,
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
