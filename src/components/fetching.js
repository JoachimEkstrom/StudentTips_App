import store from "../store/store";
import { AsyncStorage } from "react-native";

async function setToken(token, userId) {
    try {
        console.log(token);
        await AsyncStorage.setItem("Token", token);
        await AsyncStorage.setItem("userId", userId);
        console.log(token);
        console.log(userId);
    } catch (error) {
        console.log("Error in Async storage, setToken");
        console.log(error);
    }
}
async function getToken(user) {
    let token;
    let userId;
    try {
        token = await AsyncStorage.getItem("Token");
        userId = await AsyncStorage.getItem("userId");
        console.log("Getting Token");
        console.log(token);
        store.userLoggedIn({
            userName: user.userName,
            token: token,
            userId: Number(userId),
        });
    } catch (error) {
        console.log("Error in Async storage, getToken");
        console.log(error);
    }
}

async function getPins() {
    let pins = [];

    await fetch(`http://116.203.125.0:12001/pins`)
        .then((response) => response.json())
        .then((result) => {
            for (let i = 0; i < result.length; i++) {
                pins.push(result[i]);
                console.log(result[i]);
            }
        });

    await store.saveMapPins(pins);

    return null;
}

async function addPinToDb(pin, token) {
    console.log(pin);

    await fetch(`http://116.203.125.0:12001/pins`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Token: token,
        },
        body: pin,
    }).then((response) => console.log(response.status));

    await getPins();

    return null;
}

async function patchPinInDb(pin, index, token) {
    console.log(pin);
    await fetch(`http://116.203.125.0:12001/pins/` + index, {
        method: "PATCH",
        headers: {
            "Content-Type": "multipart/form-data",
            Token: token,
        },
        body: pin,
    }).then((response) => console.log(response.status));

    await getPins();

    return null;
}

async function deletePinInDb(pin, token) {
    console.log(pin);
    await fetch(`http://116.203.125.0:12001/pins/${pin}`, {
        method: "DELETE",
        headers: {
            Token: token,
        },
    }).then((response) => console.log(response.status));

    await getPins();
    return null;
}

// User handling

async function addNewUser(user) {
    console.log(user);
    let message;
    await fetch(`http://116.203.125.0:12001/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
        body: user,
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.status === 1) {
                message = true;
            } else {
                message = false;
            }
            console.log(result);
        });

    return message;
}

async function login(user) {
    let message = {
        message: "",
        loggedIn: false,
    };
    await fetch(`http://116.203.125.0:12001/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((response) => response.json())
        .then((result) => {
            message.message = result.message;
            console.log(result);

            if (result.status === 1) {
                store.userLoggedIn({
                    userName: user.userName,
                    token: result.token,
                    userId: result.user,
                });
                setToken(result.token, String(result.user));
                message.loggedIn = true;
            } else if (result.status === 3) {
                getToken(user);

                message.loggedIn = true;
            }
            console.log(message);
        });

    return message;
}

async function logout(token) {
    let message;
    await fetch(`http://116.203.125.0:12001/logout`, {
        method: "DELETE",
        headers: { Token: token },
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            message = result;
            if (result.status === 1 || result.status === 2) {
                store.userLoggedOut({
                    userName: "",
                    token: "",
                    userId: "",
                });
                setToken("", "");
                message.loggedOut = true;
            }
        });
    return message;
}

module.exports = {
    getPins,
    addPinToDb,
    patchPinInDb,
    deletePinInDb,
    addNewUser,
    login,
    logout,
};
