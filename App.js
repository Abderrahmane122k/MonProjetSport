import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/loginScreen";
import PlanningScreen from "./src/screens/PlanningScreen";

import { initDB } from "./src/database/database";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      await initDB();
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Inscription" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
        <Stack.Screen name="Planning" component={PlanningScreen} options={{ title: "Planning" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}