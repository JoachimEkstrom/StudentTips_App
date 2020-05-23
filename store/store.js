import { extendObservable } from "mobx";

class DataStorage {
  constructor() {
    extendObservable(this, {
      MapPins: [
        {
          name: "test",
          latitude: 36.24246968738326,
          longitude: -115.0825335134209,
        },
        {
          name: "Test2",
          latitude: 36.24295547509843,
          longitude: -115.07727484978403,
        },
      ],
    });
  }
}

export default new DataStorage();
