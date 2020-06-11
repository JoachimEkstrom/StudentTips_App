import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";

import HomeScreen from "./src/pages/Home";
import MapScreen from "./src/pages/MapScreen";
import NewAccount from "./src/pages/NewAccount";
import YourAccount from "./src/pages/YourAccount";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const instructions = Platform.select({
    ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
    android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" headerMode="none">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Map" component={MapTabs} />
                <Stack.Screen name="NewAccount" component={NewAccount} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
function MapTabs() {
    return (
        <Tab.Navigator initialRouteName="Map">
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="YourAccount" component={YourAccount} />
        </Tab.Navigator>
    );
}
