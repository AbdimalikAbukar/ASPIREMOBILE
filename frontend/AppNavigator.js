// navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import your screens
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import GoalScreen from "./components/GoalScreen";
import AddGoalScreen from "./components/AddGoalScreen";
import FriendManagementScreen from "./components/FriendManagementScreen"; // Import the Friend Management screen

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen
          name="Friends"
          component={FriendManagementScreen}
          options={{ title: "Manage Friends" }} // Optional: Customize title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
