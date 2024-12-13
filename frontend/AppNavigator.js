import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import your screens
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import GoalScreen from "./components/GoalScreen";
import FriendManagementScreen from "./components/FriendManagementScreen"; // Import the Friend Management screen
import AddGoalScreen from "./components/AddGoalScreen";
import GoalDetailsScreen from "./components/GoalDetailsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Dashboard, Goals, and Friends Management
function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Goals" component={GoalScreen} />
      <Tab.Screen name="Friends" component={FriendManagementScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} />
        <Stack.Screen name="GoalDetails" component={GoalDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
