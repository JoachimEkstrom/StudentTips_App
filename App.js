import * as React from "react";
import { Platform, Dimensions, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
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
        <>
            <StatusBar backgroundColor="#F77F00" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" headerMode="none">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Map" component={MapTabs} />
                    <Stack.Screen name="NewAccount" component={NewAccount} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
// Screen area
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function MapTabs() {
    return (
        <>
            <StatusBar backgroundColor="#F77F00" />
            <Tab.Navigator
                initialRouteName="Map"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case "Map":
                                iconName = "md-map";
                                break;
                            case "YourAccount":
                                iconName = "md-home";
                                break;
                        }
                        return (
                            <Ionicons
                                name={iconName}
                                size={deviceHeight * 0.04}
                                color={color}
                            />
                        );
                    },
                })}
                tabBarOptions={{
                    activeTintColor: "#F77F00",
                    inactiveTintColor: "gray",
                    showLabel: true,
                    labelStyle: {
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "black",
                    },
                    style: {
                        backgroundColor: "#FCBF49",
                        borderTopColor: "#000",
                        borderTopWidth: 2,
                        height: deviceHeight * 0.08,
                        paddingBottom: deviceHeight * 0.015,
                        paddingTop: deviceHeight * 0.015,
                    },
                }}
            >
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="YourAccount" component={YourAccount} />
            </Tab.Navigator>
        </>
    );
}
