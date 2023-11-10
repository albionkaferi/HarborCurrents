import React from "react";
import { View, Button } from "react-native";

export default function LoginScreen({ login }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Log In" onPress={login} />
    </View>
  );
}
