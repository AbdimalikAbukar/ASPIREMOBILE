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
  const { goalId } = route.params || {};
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const authToken = await SecureStore.getItemAsync("authToken");

        if (!authToken) {
          Alert.alert("Error", "No auth token found. Please log in.");
          return;
        }

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
        setGoals(goals.filter((goal) => goal._id !== selectedGoalId));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      Alert.alert("Error", "Failed to delete goal.");
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Goals</Text>

      <Button
        title="Add Goal"
        onPress={() => navigation.navigate("AddGoal")}
        style={styles.addButton}
      />

      <FlatList
        data={goals}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text style={styles.goalDeadline}>
              Deadline: {new Date(item.deadline).toLocaleDateString()}
            </Text>

            <View style={styles.buttonsContainer}>
              <Button
                title="View"
                onPress={() =>
                  navigation.navigate("GoalDetails", { goalId: item._id })
                }
              />
              <Button
                title="Delete"
                onPress={() => {
                  setSelectedGoalId(item._id);
                  setModalVisible(true);
                }}
                color="red"
              />
            </View>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this goal?
            </Text>

            <Button
              title="Yes, Delete"
              onPress={handleDelete}
              disabled={loading}
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F8FF",
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
