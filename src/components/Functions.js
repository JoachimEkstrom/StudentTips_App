import store from "../store/store";
import * as Fetching from "../components/fetching";

function deleteMapPin(index, pinId) {
    Fetching.deletePinInDb(pinId);
    store.deleteOneMapPin(index);
}

module.exports = { deleteMapPin };
