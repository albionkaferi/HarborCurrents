import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function ChartScreen() {
  const screenWidth = Dimensions.get("window").width;

  const chartConfig = {
    backgroundColor: "#f3f3f3",
    backgroundGradientFrom: "#f3f3f3",
    backgroundGradientTo: "#f3f3f3",
    color: (opacity = 1) => `rgba(21, 98, 207, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const data = {
    labels: ["02", "08", "14", "20", "26", "32", "38", "44", "50", "56"],
    datasets: [
      {
        data: [0.57, 0.44, 0.62, 0.47, 0.34, 0.24, 0.33, 0.26, 0.22, 0.11],
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
