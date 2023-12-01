import React, { useState, useContext } from "react";
import { View, Button, TextInput, Text, StyleSheet } from "react-native";

export default function LoginScreen({ AuthContext }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.error}>{error}</Text>
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
      <Button
        style={styles.btn}
        title="Sign in"
        onPress={() => signIn({ username, password }, setError)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "80%",
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    padding: 10,
  },
  error: {
    color: "red",
  },
});
