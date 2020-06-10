import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import HomeScreen from "./src/pages/Home";
import MapScreen from "./src/pages/MapScreen";
import NewAccount from "./src/pages/NewAccount";
import YourAccount from "./src/pages/YourAccount";

const Stack = createStackNavigator();

const instructions = Platform.select({
    ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
    android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Map" component={MapScreen} />
                <Stack.Screen name="NewAccount" component={NewAccount} />
                <Stack.Screen name="YourAccount" component={YourAccount} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#F5FCFF",
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: "center",
//         margin: 10,
//     },
//     instructions: {
//         textAlign: "center",
//         color: "#333333",
//         marginBottom: 5,
//     },
// });
