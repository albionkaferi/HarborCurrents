import { StyleSheet, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const minDate = new Date();
minDate.setDate(minDate.getDate() - 7);
minDate.setHours(23, 59, 59, 999);

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 7);
maxDate.setHours(0, 0, 0, 0);

export default function DateTimeSettings() {
  const getRoundedDate = () => {
    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() >= 30 ? 60 : 0);
    newDate.setSeconds(0);
    return newDate;
  };
  const [date, setDate] = useState(getRoundedDate());
  const [isMinDate, setIsMinDate] = useState(false);
  const [isMaxDate, setIsMaxDate] = useState(false);
  const [isMinTime, setIsMinTime] = useState(false);
  const [isMaxTime, setIsMaxTime] = useState(false);

  useEffect(() => {
    const newIsMinDate = date <= minDate;
    const newIsMaxDate = date >= maxDate;
    setIsMinDate(newIsMinDate);
    setIsMaxDate(newIsMaxDate);

    if (newIsMinDate) {
      setIsMinTime(date.getHours() === 0);
    } else {
      setIsMinTime(false);
    }

    if (newIsMaxDate) {
      setIsMaxTime(date.getHours() === 23);
    } else {
      setIsMaxTime(false);
    }
  }, [date]);

  const onChange = (event, selectedDate) => {
    const newDate = new Date(selectedDate);
    newDate.setMinutes(selectedDate.getMinutes() >= 30 ? 60 : 0);
    setDate(newDate);
  };

  const onClick = (type, operation) => {
    const newDate = new Date(date);
    if (type === "date") {
      if (
        (operation === "increment" && isMaxDate) ||
        (operation === "decrement" && isMinDate)
      )
        return;
      const value = operation === "increment" ? 1 : -1;
      newDate.setDate(newDate.getDate() + value);
    } else if (type === "time") {
      if (
        (operation === "increment" && isMaxTime) ||
        (operation === "decrement" && isMinTime)
      )
        return;
      const value = operation === "increment" ? 1 : -1;
      newDate.setHours(newDate.getHours() + value);
    }
    setDate(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Pressable
          style={() => [
            { backgroundColor: isMinDate ? "#a3a3a3" : "#f87171" },
            styles.btn,
          ]}
          onPress={() => onClick("date", "decrement")}
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
          style={() => [
            { backgroundColor: isMaxDate ? "#a3a3a3" : "#34d399" },
            styles.btn,
          ]}
          onPress={() => onClick("date", "increment")}
        >
          <Text style={styles.btnText}>+1 Day</Text>
        </Pressable>
      </View>
      <View style={styles.pickerContainer}>
        <Pressable
          style={() => [
            { backgroundColor: isMinTime ? "#a3a3a3" : "#f87171" },
            styles.btn,
          ]}
          onPress={() => onClick("time", "decrement")}
        >
          <Text style={styles.btnText}>-1 Hour</Text>
        </Pressable>
        <DateTimePicker
          style={styles.picker}
          testID="timePicker"
          value={date}
          mode={"time"}
          minuteInterval={30}
          is24Hour={true}
          onChange={onChange}
        />
        <Pressable
          style={() => [
            styles.btn,
            {
              backgroundColor: isMaxTime ? "#a3a3a3" : "#34d399",
              marginLeft: 20,
            },
          ]}
          onPress={() => onClick("time", "increment")}
        >
          <Text style={styles.btnText}>+1 Hour</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
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
