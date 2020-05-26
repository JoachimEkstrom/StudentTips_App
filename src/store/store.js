import { extendObservable } from "mobx";

class DataStorage {
  constructor() {
    extendObservable(this, {
      MapPins: [
        {
          pinTitle: "test",
          pinCoordinates: {
            y: 36.24246968738326,
            x: -115.0825335134209,
          },
          pinImage: "",
          pinTags: ["Bazinga", "Nevada"],
          pinUser: 1,
          pinDescription: "",
        },
        {
          pinTitle: "Test2",
          pinCoordinates: {
            y: 36.24295547509843,
            x: -115.07727484978403,
          },
          pinImage: "",
          pinTags: ["Las Vegas", "Nevada", "Test2"],
          pinUser: 0,
          pinDescription: "",
        },
      ],
      currentUser: {
        userName: "Berra",
        userId: 1,
        isAdmin: false,
      },
      modalinfo: {
        pinTitle: "",
        pinCoordinates: {
          x: 0,
          y: 0,
        },
        index: 0,
        showDeleteButton: false,
      },
      MapPinsTesting: ["", ""],
    });
  }
}

export default new DataStorage();
