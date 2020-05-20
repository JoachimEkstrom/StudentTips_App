import { extendObservable } from "mobx";

class DataStorage {
  constructor() {
    extendObservable(this, {
      MapPins: {},
      Altitude: 0,
      Longitude: 0,
      Latitude: 0,
    });
  }
}

export default new DataStorage();
