import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SettingsScreen({ logout }) {
  const [date, setDate] = useState(new Date());

  const minDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <View style={styles.pickerContainer}>
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode={"date"}
            is24Hour={true}
            onChange={onChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
          <DateTimePicker
            testID="timePicker"
            value={date}
            mode={"time"}
            is24Hour={true}
            onChange={onChange}
            minuteInterval={10}
          />
        </View>
      </View>
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    marginBottom: 40,
  },
});
