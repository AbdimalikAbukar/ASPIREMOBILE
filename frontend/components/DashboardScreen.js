import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // Ensure SecureStore is imported

const DashboardScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // Retrieve token from SecureStore
        const authToken = await SecureStore.getItemAsync("authToken");

        if (!authToken) {
          setError("No auth token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://192.168.2.207:3000/api/goals",
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Send token in the header
            },
          }
        );

        if (response.data && response.data.length > 0) {
          setGoals(response.data); // Set the fetched goals
        } else {
          setError("No goals found.");
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError("Failed to fetch goals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <Text>Dashboard</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item._id.toString()} // Use _id for the key
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>
              Deadline: {new Date(item.deadline).toLocaleDateString()}
            </Text>
            <Button
              title="Go to Goal"
              onPress={() => navigation.navigate("Goal", { goalId: item._id })}
            />
          </View>
        )}
      />
      <Button title="Add Goal" onPress={() => navigation.navigate("AddGoal")} />
    </View>
  );
};

export default DashboardScreen;
