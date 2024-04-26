import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Harbor Currents</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#7dd3fc" : "#0ea5e9" },
          styles.btn,
        ]}
        onPress={() => signIn({ username, password }, setError)}
      >
        <Text style={styles.btnText}>Sign in</Text>
      </Pressable>
      <Text style={styles.error}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#d4d4d4",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  error: {
    color: "red",
  },
  btn: {
    width: "80%",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  logo: {
    width: 64,
    height: 64,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#346ea8",
    marginLeft: 4,
    marginRight: 16,
  },
});
