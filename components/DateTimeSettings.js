import { StyleSheet, View, Text, Pressable } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getRoundedDate } from "../lib/utils";

const minDate = getRoundedDate();
minDate.setDate(minDate.getDate() - 90);
minDate.setHours(23, 59, 59, 999);

const maxDate = getRoundedDate();
maxDate.setDate(maxDate.getDate() + 5);
maxDate.setHours(0, 0, 0, 0);

export default function DateTimeSettings({ date, setDate }) {
  const [isMinDate, setIsMinDate] = useState(false);
  const [isMaxDate, setIsMaxDate] = useState(false);
  const [isMinTime, setIsMinTime] = useState(false);
  const [isMaxTime, setIsMaxTime] = useState(false);

  const updateMinMax = (newDate) => {
    const newIsMinDate = newDate <= minDate;
    const newIsMaxDate = newDate >= maxDate;
    setIsMinDate(newIsMinDate);
    setIsMaxDate(newIsMaxDate);
    if (newIsMinDate) {
      setIsMinTime(newDate.getHours() === 0);
    } else {
      setIsMinTime(false);
    }
    if (newIsMaxDate) {
      setIsMaxTime(newDate.getHours() === 23);
    } else {
      setIsMaxTime(false);
    }
  };

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    updateMinMax(selectedDate);
  };

  const onClick = (type, operation) => {
    const newDate = new Date(date);
    const value = operation === "increment" ? 1 : -1;
    if (type === "date") {
      newDate.setDate(newDate.getDate() + value);
    } else if (type === "time") {
      newDate.setHours(newDate.getHours() + value);
    }
    setDate(newDate);
    updateMinMax(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: isMinDate ? "#a3a3a3" : "#f87171" },
            styles.btn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => onClick("date", "decrement")}
          disabled={isMinDate}
        >
          <Text style={styles.btnText}>-1 Day</Text>
        </Pressable>
        <DateTimePicker
          style={styles.picker}
          testID="datePicker"
          value={date}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: isMaxDate ? "#a3a3a3" : "#34d399" },
            styles.btn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => onClick("date", "increment")}
          disabled={isMaxDate}
        >
          <Text style={styles.btnText}>+1 Day</Text>
        </Pressable>
      </View>
      <View style={styles.pickerContainer}>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: isMinTime ? "#a3a3a3" : "#f87171" },
            styles.btn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => onClick("time", "decrement")}
          disabled={isMinTime}
        >
          <Text style={styles.btnText}>-1 Hour</Text>
        </Pressable>
        <DateTimePicker
          style={styles.picker}
          testID="timePicker"
          value={date}
          mode={"time"}
          minuteInterval={20}
          is24Hour={true}
          onChange={onChange}
        />
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: isMaxTime ? "#a3a3a3" : "#34d399",
              marginLeft: 20,
              opacity: pressed ? 0.5 : 1,
            },
          ]}
          onPress={() => onClick("time", "increment")}
          disabled={isMaxTime}
        >
          <Text style={styles.btnText}>+1 Hour</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    zIndex: 1,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  picker: {
    margin: 0,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  btnText: { color: "white", fontWeight: "bold" },
});
