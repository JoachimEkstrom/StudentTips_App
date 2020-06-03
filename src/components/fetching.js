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

    store.saveMapPins(pins);
    return null;
}

async function addPinToDb(pin) {
    pin = JSON.stringify(pin);

    await fetch(`http://116.203.125.0:12001/pins`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: pin,
    }).then((response) => console.log(response.status));

    return null;
}

function patchPinInDb(pin) {
    fetch(`http://116.203.125.0:12001/pins/` + pin.pinId, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pin),
    }).then((response) => console.log(response.status));

    return null;
}

async function deletePinInDb(pin) {
    console.log(pin);
    await fetch(`http://116.203.125.0:12001/pins/${pin}`, {
        method: "DELETE",
    }).then((response) => console.log(response.status));
    return null;
}

module.exports = { getPins, addPinToDb, patchPinInDb, deletePinInDb };
