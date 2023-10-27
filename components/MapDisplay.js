import { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// scripts
import { averageData } from '../scripts/dataManipulation.js';
import { magnitudeToColor } from '../scripts/color.js';

function MapDisplay(props) {
    function updateData(region) {
        const out = Math.floor(200 * (region.latitudeDelta - 0.08414570425311751) + 20);
        setMapData(averageData(props.data, out));
    }
    
    function dataToMarker(dataPoint) {
        return (
            <Marker
                coordinate={dataPoint.point}
                anchor={(0,0.5)}
                key={`${dataPoint.point.latitude}_${dataPoint.point.longitude}`}
            >
                <Image
                    source={require('../assets/arrow.png')}
                    style={{tintColor:magnitudeToColor(dataPoint.magnitude)}}
                    transform={[
                        {rotate:`${dataPoint.direction}deg`},
                        {scaleX:dataPoint.magnitude*6}
                    ]}
                />
            </Marker>
        );
    }

    const [mapRotation, setMapRotation] = useState(0);
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
});

export default MapDisplay;