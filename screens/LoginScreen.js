import React, { useState, useContext } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";

export default function LoginScreen({ AuthContext }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
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
});
