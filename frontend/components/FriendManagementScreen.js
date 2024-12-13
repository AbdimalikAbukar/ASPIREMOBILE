import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const FriendManagementScreen = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);

  const getAuthToken = async () => {
    try {
      return await SecureStore.getItemAsync("authToken");
    } catch (err) {
      setError("Failed to retrieve auth token.");
      return null;
    }
  };

  const getFriends = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.get(
        "http://192.168.2.207:3000/api/friends/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Friends response data:", response.data);

      const { acceptedFriends, pendingReceivedRequests, sentRequests } =
        response.data;

      setFriends(acceptedFriends || []);
      setPendingRequests(pendingReceivedRequests || []);
      setSentRequests(sentRequests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching friends");
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.post(
        "http://192.168.2.207:3000/api/friends/request",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      setModalVisible(false);
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error sending friend request");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.put(
        `http://192.168.2.207:3000/api/friends/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error accepting friend request");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.delete(
        `http://192.168.2.207:3000/api/friends/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing friend");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.get(
        "http://192.168.2.207:3000/api/friends/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  const filterUsers = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    getFriends();
    fetchAllUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Management</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by username"
              value={searchQuery}
              onChangeText={filterUsers}
            />
            <ScrollView style={styles.userListContainer}>
              {filteredUsers.length === 0 ? (
                <Text>No users found.</Text>
              ) : (
                filteredUsers.map((user) => (
                  <View key={user._id} style={styles.friendItem}>
                    <Text>
                      {user.username} ({user.email})
                    </Text>
                    <Button
                      title="Add"
                      onPress={() => sendFriendRequest(user._id)}
                      color="blue"
                    />
                  </View>
                ))
              )}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.section}>
        <Text style={styles.sectionTitle}>Friends List</Text>
        {friends.length === 0 ? (
          <Text>No friends yet.</Text>
        ) : (
          friends.map((friend) => (
            <View key={friend._id} style={styles.friendItem}>
              <Text>
                {friend.username} ({friend.email})
              </Text>
              <Button
                title="Remove"
                onPress={() => removeFriend(friend._id)}
                color="red"
              />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
        {pendingRequests.length === 0 ? (
          <Text>No pending requests.</Text>
        ) : (
          pendingRequests.map((request) => (
            <View key={request._id} style={styles.friendItem}>
              <Text>
                {request.user.username} ({request.user.email})
              </Text>
              <Button
                title="Accept"
                onPress={() => acceptFriendRequest(request._id)}
                color="green"
              />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Sent Friend Requests</Text>
        {sentRequests.length === 0 ? (
          <Text>No sent requests.</Text>
        ) : (
          sentRequests.map((request) => (
            <View key={request._id} style={styles.friendItem}>
              <Text>{request.friend?.username || "No username"}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F8FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  friendItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userListContainer: {
    maxHeight: "60%",
  },
});

export default FriendManagementScreen;
