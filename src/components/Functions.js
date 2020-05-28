import DataStorage from "../store/store";
import * as Fetching from "../components/fetching";

function deleteMapPin(index, pinId) {
  Fetching.deletePinInDb(pinId);
  DataStorage.MapPins.splice(index, 1);
}

module.exports = { deleteMapPin };
