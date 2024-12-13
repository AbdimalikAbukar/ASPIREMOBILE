import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const GoalScreen = ({ route }) => {
  const { goalId } = route.params || {}; // Retrieve goalId from navigation params, if available
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state for delete confirmation
  const [selectedGoalId, setSelectedGoalId] = useState(null); // Store the selected goal ID for deletion
  const navigation = useNavigation();

  // Fetch goals when the component is mounted
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const authToken = await SecureStore.getItemAsync("authToken");

        if (!authToken) {
          Alert.alert("Error", "No auth token found. Please log in.");
          return;
        }

        // Fetch the list of goals
        const response = await axios.get(
          "http://192.168.2.207:3000/api/goals",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
        Alert.alert("Error", "Failed to load goals.");
      }
    };

    fetchGoals();
  }, []);

  // Handle deleting the goal
  const handleDelete = async () => {
    try {
      setLoading(true);
      const authToken = await SecureStore.getItemAsync("authToken");

      if (!authToken) {
        Alert.alert("Error", "No auth token found. Please log in.");
        return;
      }

      const response = await axios.delete(
        `http://192.168.2.207:3000/api/goals/delete/${selectedGoalId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Goal deleted successfully.");
        setGoals(goals.filter((goal) => goal._id !== selectedGoalId)); // Remove deleted goal from the list
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      Alert.alert("Error", "Failed to delete goal.");
    } finally {
      setLoading(false);
      setModalVisible(false); // Close the modal after deleting
    }
  };

  return (
    <View>
      <Text>Add Goal</Text>
      {error && <Text>{error}</Text>}
      <TextInput
        placeholder="Goal Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    marginBottom: 20,
  },
  goalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goalDeadline: {
    marginVertical: 8,
    color: "gray",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default GoalScreen;
