// screens/GoalScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GoalScreen = ({ route }) => {
  const { goalId } = route.params; // Retrieve goalId from navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Details</Text>
      <Text>Goal ID: {goalId}</Text>
      <Text>Description: This is a detailed description of the goal.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default GoalScreen;
