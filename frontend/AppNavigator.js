// navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import your screens
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import GoalScreen from "./components/GoalScreen";
import AddGoalScreen from "./components/AddGoalScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="Friends" component={AddGoalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
