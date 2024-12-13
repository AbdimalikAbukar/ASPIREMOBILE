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
import { useNavigation, useRoute } from "@react-navigation/native";

const GoalDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { goalId } = route.params;
  const [goal, setGoal] = useState(null);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [friendId, setFriendId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGoalAndFriends = async () => {
      try {
        setLoading(true);
        const authToken = await SecureStore.getItemAsync("authToken");

        if (!authToken) {
          Alert.alert("Error", "No auth token found. Please log in.");
          return;
        }

        // Fetch goal details
        const goalResponse = await axios.get(
          `http://192.168.2.207:3000/api/goals/${goalId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("Goal Response:", goalResponse.data);
        setGoal(goalResponse.data);

        const friendsResponse = await axios.get(
          "http://192.168.2.207:3000/api/friends/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("Friends Response:", friendsResponse.data);
        setAcceptedFriends(friendsResponse.data.acceptedFriends);
      } catch (error) {
        console.error("Error fetching goal or friends:", error);
        Alert.alert("Error", "Failed to load goal or friends.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalAndFriends();
  }, [goalId]);

  const handleShare = async () => {
    if (!friendId) {
      Alert.alert("Error", "Please select a friend to share the goal with.");
      return;
    }

    try {
      setLoading(true);
      const authToken = await SecureStore.getItemAsync("authToken");
      if (!authToken) {
        Alert.alert("Error", "No auth token found. Please log in.");
        return;
      }

      const response = await axios.post(
        `http://192.168.2.207:3000/api/goals/share/${goalId}`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Goal shared successfully.");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error sharing goal:", error);
      Alert.alert("Error", "Failed to share goal.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!goal) {
    return <Text>No goal details found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Details</Text>
      <Text style={styles.text}>Title: {goal.title}</Text>
      <Text style={styles.text}>
        Deadline: {new Date(goal.deadline).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Description: {goal.description}</Text>
      <Button
        title="Share Goal"
        onPress={() => setModalVisible(true)}
        disabled={loading}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Friend to Share With</Text>

            <FlatList
              data={acceptedFriends || []}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => {
                    setFriendId(item._id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.friendName}>{item.username}</Text>
                </TouchableOpacity>
              )}
            />

            <Button
              title="Share Goal"
              onPress={handleShare}
              disabled={loading || !friendId}
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
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F0F8FF",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
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
  friendItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 5,
  },
  friendName: {
    fontSize: 16,
  },
});

export default GoalDetailsScreen;
