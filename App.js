// react
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// data
import data from './data/data.json';
// scripts
import MapDisplay from './components/MapDisplay.js'

export default function App() {
  return (
    <MapDisplay data={data}/>
  );
}