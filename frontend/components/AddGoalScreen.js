// screens/AddGoalScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { addGoal } from "../redux/actions/goalActions";

const AddGoalScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const dispatch = useDispatch();

  const handleAddGoal = () => {
    const newGoal = { id: Date.now(), title, description, deadline };
    dispatch(addGoal(newGoal)); // Dispatch the addGoal action
    navigation.goBack(); // Navigate back to the Dashboard
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Goal</Text>
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
        placeholder="Deadline"
        value={deadline}
        onChangeText={setDeadline}
      />
      <Button title="Add Goal" onPress={handleAddGoal} />
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default AddGoalScreen;
