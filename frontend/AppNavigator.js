import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import your screens
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen"; // Import RegisterScreen
import DashboardScreen from "./components/DashboardScreen";
import GoalScreen from "./components/GoalScreen";
import FriendManagementScreen from "./components/FriendManagementScreen";
import AddGoalScreen from "./components/AddGoalScreen";
import GoalDetailsScreen from "./components/GoalDetailsScreen";
import AccountScreen from "./components/AccountScreen"; // Import the Account screen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Dashboard, Goals, Friends Management, and Account
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalScreen} />
      <Tab.Screen name="Friends" component={FriendManagementScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen} // Add RegisterScreen here
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator} // Use TabNavigator correctly here
          options={{ headerShown: false }} // Hides header for the TabNavigator screen
        />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen name="GoalDetails" component={GoalDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
