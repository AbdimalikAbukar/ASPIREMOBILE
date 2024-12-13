import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AddGoalScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddGoal = async () => {
    if (!title || !description || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const authToken = await SecureStore.getItemAsync("authToken");

      if (!authToken) {
        Alert.alert("Error", "No auth token found. Please log in.");
        return;
      }

      await axios.post(
        "http://192.168.2.207:3000/api/goals/add",
        { title, description, deadline },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      Alert.alert("Success", "Goal added successfully.");
      navigation.goBack(); // Navigate back to the previous screen after adding
    } catch (err) {
      console.error("Error adding goal:", err);
      setError("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Goal</Text>
      {error && <Text>{error}</Text>}
      <TextInput
        placeholder="Goal Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
        style={styles.input}
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
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default AddGoalScreen;
