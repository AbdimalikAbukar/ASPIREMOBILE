import React from "react";
import { StoreProvider } from "./redux/store";
import AppNavigator from "./AppNavigator";

export default function App() {
  return (
    <StoreProvider>
      <AppNavigator />
    </StoreProvider>
  );
}
