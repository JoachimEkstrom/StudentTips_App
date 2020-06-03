import React, { component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useObserver } from "mobx-react-lite";
import "react-native-gesture-handler";
import * as Fetching from "../components/fetching";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

function Home({ navigation }) {
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        Fetching.getPins();
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
            }
        })();
    }, []);

    return useObserver(() => (
        <View style={styles.container}>
            {errorMsg && <Text>{errorMsg}</Text>}
            <Button
                title="Create new Account"
                onPress={() => navigation.navigate("NewAccount")}
            />
            <Button
                title="Your Account"
                onPress={() => navigation.navigate("YourAccount")}
            />
            <Button
                title="Go to Map page"
                onPress={() => navigation.navigate("Map")}
            />
        </View>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Home;
