import { useState } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
// scripts
import { averageData, slimData, filterRange } from '../scripts/dataManipulation.js';
import { magnitudeToColor } from '../scripts/color.js';

const initialRegion = {
    "latitude": 40.64769198828401,
    "latitudeDelta": 0.19197685408637,
    "longitude": -74.13179607431394,
    "longitudeDelta": 0.12868797758112294
};

function dataToMarker(dataPoint) {
    return (
        <Marker
            coordinate={dataPoint.point}
            anchor={(0,0.5)}
            key={`${dataPoint.point.latitude}_${dataPoint.point.longitude}`}
            tracksViewChanges={false}
        >
            <Image
                source={require('../assets/arrow.png')}
                style={{tintColor:magnitudeToColor(dataPoint.magnitude)}}
                transform={[
                    {rotate:`${dataPoint.direction}deg`},
                    {scaleX:dataPoint.magnitude*6}
                ]}
            />
            <Callout style={styles.markerInfoStyle}>
                <Text>
                    {`Latitude: ${dataPoint.point.latitude.toFixed(3)}\nLongitude: ${dataPoint.point.longitude.toFixed(3)}\nMagnitude: ${dataPoint.magnitude.toFixed(3)} m/s\nDirection: ${dataPoint.direction.toFixed(3)}°`}
                </Text>
            </Callout>
        </Marker>
    );
}

function MapDisplay(props) {
    function updateData(region) {
        console.log(region);
        const out = Math.floor(200 * (region.latitudeDelta - 0.08414570425311751) + 20);
        setMapData(filterRange(averageData(props.data, out), region));
    }

    const [mapData, setMapData] = useState(averageData(props.data, 20));

    return (
        <MapView
          ref={(map) => { this.map = map; }}
          style={styles.container}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          showsIndoors={false}
          rotateEnabled={false}
          onRegionChangeComplete={updateData}
          initialRegion={initialRegion}
        >
          {mapData.map(dataToMarker)}
        </MapView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerInfoStyle: {
        backgroundColor: '#ffffff',
        width: 150
    }
});

export default MapDisplay;