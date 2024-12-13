import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // Ensure SecureStore is imported

const DashboardScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(""); // State to store the quote
  const [author, setAuthor] = useState(""); // State to store the author

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

    // Fetch the quote data
    const fetchQuote = async () => {
      try {
        const response = await axios.get("http://192.168.2.207:3000/"); // Change to your API endpoint that returns the quote
        setQuote(response.data.quote);
        setAuthor(response.data.author);
      } catch (err) {
        console.error("Error fetching quote:", err);
        setQuote("Failed to load quote.");
        setAuthor("");
      }
    };

    fetchGoals();
    fetchQuote();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  // Filter goals that have a deadline within a week
  const upcomingGoals = goals.filter((goal) => {
    const currentDate = new Date();
    const deadlineDate = new Date(goal.deadline);
    const timeDiff = deadlineDate - currentDate;
    const daysRemaining = timeDiff / (1000 * 3600 * 24);
    return daysRemaining >= 0 && daysRemaining <= 7; // Goal deadline is within the next 7 days
  });

  // Get today's date
  const today = new Date();
  const todayDate = today.toLocaleDateString(); // Format the current date

  return (
    <View style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Welcome to Aspire</Text>
      </View>

      {/* Display Today's Date */}
      <Text style={styles.dateText}>Today's Date: {todayDate}</Text>

      {/* Display Quote */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quote}"</Text>
        {author && <Text style={styles.authorText}>- {author}</Text>}
      </View>

      {/* Upcoming Deadlines Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>

        {/* Display goals with upcoming deadlines */}
        {upcomingGoals.length > 0 ? (
          <FlatList
            data={upcomingGoals}
            keyExtractor={(item) => item._id.toString()} // Use _id for the key
            renderItem={({ item }) => (
              <View style={styles.goalContainer}>
                <Text style={styles.goalTitle}>{item.title}</Text>
                <Text style={styles.goalDeadline}>
                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                </Text>
                <Button
                  title="Go to Goal"
                  onPress={() =>
                    navigation.navigate("Goal", { goalId: item._id })
                  }
                />
              </View>
            )}
          />
        ) : (
          <Text>No goals with upcoming deadlines.</Text>
        )}
      </View>

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
  dateText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  quoteContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
  },
  authorText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
