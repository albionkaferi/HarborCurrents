import { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { formatBoth } from "../lib/webScraper.js";
import { AuthContext } from "../contexts/AuthContext.js";

const screenWidth = Dimensions.get("window").width;

export default function ChartScreen() {
  const { userToken } = useContext(AuthContext);
  const [deltaData, setDeltaData] = useState();
  const [actualData, setActualData] = useState();
  const [predictedData, setPredictedData] = useState();
  const [originalTimestamp, setOriginalTimestamp] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { actual, predicted, labels, originalDate } = await formatBoth(
          userToken
        );
        setOriginalTimestamp(originalDate);
        setActualData(actual);
        setPredictedData(predicted);
        setDeltaData(labels);
        setIsLoading(false);
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
    color: (opacity = 1) => `rgba(38, 38, 38, ${opacity})`,
  };

  const data = {
    labels: deltaData,
    datasets: [
      {
        data: actualData,
        color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: predictedData,
        color: (opacity = 1) => `rgba(153, 27, 27, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Actual", "Predicted"],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Time Series Charts</Text>
      <View style={styles.textContainer}>
        <Text style={styles.subHeader}>
          This chart compares the predicted and actual speeds (in knots) of
          currents along the
          <Text style={styles.channel}> Kill Van Kull channel.</Text>
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.chartContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <LineChart
              data={data}
              width={screenWidth - 28}
              height={200}
              chartConfig={chartConfig}
              withDots={false}
              withVerticalLines={false}
              verticalLabelRotation={-90}
              withShadow={false}
              bezier
              style={styles.chart}
            />
            <Text style={styles.sideText}>Speed (knots)</Text>
            <Text style={styles.axisText}>Hours from {originalTimestamp}</Text>
          </View>
        </>
      )}
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
  chart: {
    marginLeft: 12,
  },
  axisText: {
    position: "relative",
    left: "50%",
    transform: [{ translateX: -80 }],
    fontSize: 14,
    fontWeight: "500",
    color: "#262626",
    marginTop: 8,
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
    marginTop: 16,
    marginLeft: 32,
    marginRight: 32,
    fontSize: 16,
    fontWeight: "500",
    color: "#191919",
  },
  sideText: {
    position: "absolute",
    top: "50%",
    left: -24,
    transform: [{ rotate: "-90deg" }, { translateX: 20 }],
    color: "#262626",
    fontSize: 12,
    fontWeight: "500",
    zIndex: 1,
  },
  channel: {
    fontWeight: "bold",
  },
});
