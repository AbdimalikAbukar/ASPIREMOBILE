import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios"; // Or your preferred HTTP client

const AccountScreen = ({ navigation }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      try {
        // Retrieve the authToken from SecureStore
        const authToken = await SecureStore.getItemAsync("authToken");

        if (!authToken) {
          Alert.alert("Error", "No auth token found. Please log in.");
          setUserLoggedIn(false);
          return;
        }

        // Debugging: Log the token to check if it's being fetched correctly
        console.log("Auth Token:", authToken);

        // Make an API call to fetch user data
        const response = await axios.get("http://192.168.2.207:3000/api/user", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send the token as Authorization header
          },
        });

        // Debugging: Log the response to ensure it's coming back as expected
        console.log("User data response:", response.data);

        if (response.status === 200 && response.data) {
          // If data is returned, set it in the state
          setUserLoggedIn(true);
          setUserData(response.data);
        } else {
          Alert.alert("Error", "Failed to fetch user data.");
          setUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        Alert.alert("Error", "Failed to check login status.");
        setUserLoggedIn(false);
      }
    };

    checkUserLoginStatus();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setUserLoggedIn(false);
    setUserData(null);
  };

  return (
    <View style={styles.container}>
      {userLoggedIn ? (
        <View style={styles.profileContainer}>
          <Text style={styles.profileHeading}>User Profile</Text>
          <Text>Name: {userData?.name}</Text>
          <Text>Email: {userData?.email}</Text>
          <Text>User ID: {userData?.userId}</Text>
          <Text>Day Joined: {userData?.joinDate}</Text>
          <Button title="Logout" onPress={handleLogout} color="#f44336" />
        </View>
      ) : (
        <Text>Please log in to view your profile.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    alignItems: "center",
  },
  profileHeading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default AccountScreen;
