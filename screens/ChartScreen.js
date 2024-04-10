import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatPredicted } from '../lib/webScraper.js';

export default function ChartScreen() {
  const screenWidth = Dimensions.get("window").width;
  const [scraperData, setScraperData] = useState(null);
  const [deltaData, setDeltaData] = useState(null);
  const [speedData, setSpeedData] = useState(null);
  const [originalTimestamp, setOriginalTimestamp] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, originalTime} = await formatPredicted("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html");
        setOriginalTimestamp(originalTime);
        let delta = []
        let echo = []
        for (let i = 0; i < data.length; i++) {
          if (i % Math.floor(data.length/10) === 0) delta.push(data[i][0])
          else delta.push("")
          echo.push(data[i][1])
        }
        setDeltaData(delta);
        setSpeedData(echo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    backgroundColor: "#f3f3f3",
    backgroundGradientFrom: "#f3f3f3",
    backgroundGradientTo: "#f3f3f3",
    color: (opacity = 1) => `rgba(21, 98, 207, ${opacity})`,
    strokeWidth: 1,
    barPercentage: 0.5,
  };

  if (!deltaData || !speedData) {
    return null; // You can return a loading indicator here
  }

  const data = {
    labels: deltaData,
    datasets: [
      {
        data: speedData,
        color: (opacity = 100) => `rgba(0, 0, 139, 100)`,
        strokeWidth: 2,
        dotSize: 10,
    withDots: false,
      },
    ],
    legend: ["Speed (knots) at given minute"],
  };
  const showDotIndex = 200;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Kill Van Kull, Along Channel Velocity</Text>
        <Text style={styles.dateText}>{originalTimestamp}</Text>
      </View>
      <LineChart
        data={data}
        width={screenWidth-20}
        height={220}
        chartConfig={chartConfig}
      />
      <Text style={styles.axisText}>Hours from original time</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  textContainer: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "500",
    marginLeft: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 20,
  },
  axisText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 130
  }
});
//y