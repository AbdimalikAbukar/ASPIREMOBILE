import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList } from "react-native";
import axios from "axios";

const DashboardScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example: Assume the token is stored in a state or AsyncStorage
  const authToken = "your-auth-token-here"; // Replace with actual token retrieval logic

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/goals", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send token in the header
          },
        });
        setGoals(response.data.goals); // Assuming response contains goals array
      } catch (err) {
        setError("Failed to fetch goals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [authToken]);

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button
              title="Go to Goal"
              onPress={() => navigation.navigate("Goal", { goalId: item.id })}
            />
          </View>
        )}
      />
      <Button title="Add Goal" onPress={() => navigation.navigate("AddGoal")} />
    </View>
  );
};

export default DashboardScreen;
