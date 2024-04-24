import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatBoth } from '../lib/webScraper.js';

export default function ChartScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [deltaData, setDeltaData] = useState(null);
  const [speedData, setSpeedData] = useState(null);
  const [speedData2, setSpeedData2] = useState(null);
  const [originalTimestamp, setOriginalTimestamp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {series, predicted, labels, originalDate} = await formatBoth();
        setOriginalTimestamp(originalDate);
        setSpeedData2(series.map((it)=>it[0]));
        setSpeedData(predicted.map((it)=>it[0]));
        setDeltaData(labels);
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
    barPercentage: 0.5
  };

  if (!deltaData || !speedData || !speedData2) {
    return null; // You can return a loading indicator here
  }

  const data = {
    datasets: [
      {
        data: speedData,
        color: (opacity = 1) => `rgba(10, 66, 145, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Speed (knots) at given minute"],
  };

  const data2 = {
    labels: deltaData,
    datasets: [
      {
        data: speedData2,
        color: (opacity = 1) => `rgba(10, 66, 145, ${opacity})`,
        strokeWidth: 2,
      },
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Kill Van Kull, Along Channel Velocity</Text>
        <Text style={styles.dateText}>{originalTimestamp}</Text>
      </View>
      <Text style={styles.dateText}>Predicted</Text>
      <LineChart
        data={data}
        width={screenWidth-20}
        height={220}
        chartConfig={chartConfig}
        withDots={false}
        withVerticalLines={false}
      />
      <Text style={styles.dateText}>Actual</Text>
      <LineChart
        data={data2}
        width={screenWidth-20}
        height={220}
        chartConfig={chartConfig}
        withDots={false}
        withVerticalLines={false}
        verticalLabelRotation={-90}
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