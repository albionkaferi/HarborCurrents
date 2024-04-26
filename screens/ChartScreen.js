import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatBoth } from "../lib/webScraper.js";

export default function ChartScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [deltaData, setDeltaData] = useState(null);
  const [speedData, setSpeedData] = useState(null);
  const [speedData2, setSpeedData2] = useState(null);
  const [originalTimestamp, setOriginalTimestamp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { series, predicted, labels, originalDate } = await formatBoth();
        setOriginalTimestamp(originalDate);
        setSpeedData2(series.map((it) => it[0]));
        setSpeedData(predicted.map((it) => it[0]));
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
    barPercentage: 0.5,
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
  };

  const data2 = {
    labels: deltaData,
    datasets: [
      {
        data: speedData2,
        color: (opacity = 1) => `rgba(10, 66, 145, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sideText}>Speed (knots)</Text>
      <Text style={styles.header}>Time Series Charts</Text>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          Kill Van Kull, Along Channel Velocity
        </Text>
        <Text style={styles.dateText}>{originalTimestamp}</Text>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.subHeader}>Predicted</Text>
        <LineChart
          data={data}
          width={screenWidth - 36}
          height={200}
          chartConfig={chartConfig}
          withDots={false}
          withVerticalLines={false}
          style={styles.chart}
        />
        <Text style={styles.subHeader}>Actual</Text>
        <LineChart
          data={data2}
          width={screenWidth - 36}
          height={200}
          chartConfig={chartConfig}
          withDots={false}
          withVerticalLines={false}
          verticalLabelRotation={-90}
          style={styles.chart}
        />
        <Text style={styles.axisText}>Hours from original time</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    marginBottom: 24,
  },
  chartContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    marginBottom: 64,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 32,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 32,
  },
  chart: {
    marginLeft: 10,
  },
  axisText: {
    position: "relative",
    left: "50%",
    transform: [{ translateX: -80 }],
    fontSize: 14,
    fontWeight: "500",
    color: "#1562CF",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#191919",
    marginTop: 36,
    marginLeft: 32,
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 76,
    color: "#1562CF",
  },
  sideText: {
    position: "absolute",
    top: "50%",
    left: -24,
    transform: [{ rotate: "-90deg" }, { translateX: -50 }],
    color: "#1562CF",
    fontSize: 12,
    fontWeight: "500",
    zIndex: 1,
  },
});
