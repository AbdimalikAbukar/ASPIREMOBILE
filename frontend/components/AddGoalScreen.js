import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const AddGoalScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddGoal = async () => {
    if (!title || !description || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await SecureStore.getItemAsync("authToken");

      if (!authToken) {
        setError("No auth token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://192.168.2.207:3000/api/goals/add",
        {
          title,
          description,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send token in the header
          },
        }
      );

      if (response.data) {
        navigation.goBack(); // Navigate back to the previous screen
      }
    } catch (err) {
      console.error("Error adding goal:", err);
      setError("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Goal</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Goal Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />
      <Button
        title={loading ? "Saving..." : "Save Goal"}
        onPress={handleAddGoal}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F8FF", // Zen-like background color (light blue)
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
});

export default AddGoalScreen;
