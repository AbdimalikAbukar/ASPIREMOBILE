import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome to Aspire</Text>
      </View>

      {/* Goals List */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item._id.toString()} // Use _id for the key
        renderItem={({ item }) => (
          <View style={styles.goalContainer}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text style={styles.goalDeadline}>
              Deadline: {new Date(item.deadline).toLocaleDateString()}
            </Text>
            <Button
              title="Go to Goal"
              onPress={() => navigation.navigate("Goal", { goalId: item._id })}
            />
          </View>
        )}
      />

      {/* Bottom Navigation Button */}
      <Button
        title="View All Goals"
        onPress={() => navigation.navigate("Goals")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: "#4CAF50", // You can customize the banner color
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 5,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  goalContainer: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goalDeadline: {
    fontSize: 14,
    color: "#555",
  },
});

export default DashboardScreen;
