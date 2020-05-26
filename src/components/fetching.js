import { observer } from "mobx-react";
import DataStorage from "../store/store";

async function getPins() {
  let pins = [];

  await fetch(`http://116.203.125.0:12001/pins`)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      for (let i = 0; i < result.length; i++) {
        pins.push(result[i]);
        console.log(result[i]);
      }
    });

  console.log(pins);
  DataStorage.MapPinsTesting = pins;
  return null;
}

function addPinToDb(pin) {
  console.log(pin);
  pin = JSON.stringify(pin);
  console.log(pin);

  fetch(`http://116.203.125.0:12001/pins`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: pin,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });

  return null;
}

async function deletePinInDb(pin) {
  let response = await fetch(`http://116.203.125.0:12001/pins/${pin}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });

  return null;
}

module.exports = { getPins, addPinToDb, deletePinInDb };
