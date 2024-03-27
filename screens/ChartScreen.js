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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await formatPredicted("https://cdn.tidesandcurrents.noaa.gov/ports/plots/n06010_cu_pred_24.html");
        let delta = []
        let echo = []
        for (let i = 0; i < data.length; i++) {
          delta.push(data[i][0])
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
    strokeWidth: 2,
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
        color: (opacity = 1) => `rgba(10, 66, 145, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Speed (knots) at given minute"],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.dateText}>Jan 23, 2023</Text>
        <Text style={styles.dateText}>12PM</Text>
      </View>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
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
  dateText: {
    fontSize: 24,
    fontWeight: "500",
    marginLeft: 20,
  },
});
//y