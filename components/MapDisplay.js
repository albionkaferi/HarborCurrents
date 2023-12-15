import { useContext, useState } from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
// scripts
import {
  averageData,
  slimData,
  filterRange,
} from "../scripts/dataManipulation.js";
import { magnitudeToColor } from "../scripts/color.js";
import { SettingsContext } from "../contexts/SettingsContext.js";

const initialRegion = {
  latitude: 40.64769198828401,
  latitudeDelta: 0.19197685408637,
  longitude: -74.13179607431394,
  longitudeDelta: 0.12868797758112294,
};

function dataToMarker(dataPoint, index, units) {
  let magnitude = dataPoint.magnitude;
  if (units === "mi/h") {
    magnitude *= 2.23694;
  } else if (units == "knots") {
    magnitude *= 1.94384;
  }

  return (
    <Marker
      coordinate={dataPoint.point}
      anchor={(0, 0.5)}
      key={index}
      tracksViewChanges={false}
    >
      <Image
        source={require("../assets/arrow.png")}
        style={{ tintColor: magnitudeToColor(dataPoint.magnitude) }}
        transform={[
          { rotate: `${dataPoint.direction}deg` },
          { scaleX: dataPoint.magnitude * 6 },
        ]}
      />
      <Callout style={styles.markerInfoStyle}>
        <Text>
          {`Magnitude: ${magnitude.toFixed(
            2
          )} ${units}\nDirection: ${dataPoint.direction.toFixed()}°\nLatitude: ${dataPoint.point.latitude.toFixed(
            2
          )}\nLongitude: ${dataPoint.point.longitude.toFixed(2)}`}
        </Text>
      </Callout>
    </Marker>
  );
}

function MapDisplay(props) {
  const { units } = useContext(SettingsContext);
  const [mapData, setMapData] = useState(averageData(props.data, 20));

  function updateData(region) {
    const out = Math.floor(
      200 * (region.latitudeDelta - 0.08414570425311751) + 20
    );
    setMapData(filterRange(averageData(props.data, out), region));
  }

  return (
    <MapView
      ref={(map) => {
        this.map = map;
      }}
      style={styles.container}
      showsUserLocation={true}
      showsPointsOfInterest={false}
      showsIndoors={false}
      rotateEnabled={false}
      onRegionChangeComplete={updateData}
      initialRegion={initialRegion}
    >
      {mapData.map((dataPoint, index) => dataToMarker(dataPoint, index, units))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  markerInfoStyle: {
    backgroundColor: "#ffffff",
    width: 150,
  },
});

export default MapDisplay;
