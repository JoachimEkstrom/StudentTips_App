import store from "../store/store";

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

async function addPinToDb(pin) {
    console.log(pin);

    await fetch(`http://116.203.125.0:12001/pins`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
        },
        body: pin,
    }).then((response) => console.log(response));

    await getPins();

    return null;
}

async function patchPinInDb(pin, index) {
    console.log(pin);
    await fetch(`http://116.203.125.0:12001/pins/` + index, {
        method: "PATCH",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: pin,
    }).then((response) => console.log(response));

    await getPins();

    return null;
}

async function deletePinInDb(pin) {
    console.log(pin);
    await fetch(`http://116.203.125.0:12001/pins/${pin}`, {
        method: "DELETE",
    }).then((response) => console.log(response.status));

    await getPins();
    return null;
}

module.exports = {
    getPins,
    addPinToDb,
    patchPinInDb,
    deletePinInDb,
};
