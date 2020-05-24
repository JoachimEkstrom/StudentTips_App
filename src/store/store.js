import { extendObservable } from "mobx";

class DataStorage {
  constructor() {
    extendObservable(this, {
      MapPins: [
        {
          title: "test",
          coords: {
            latitude: 36.24246968738326,
            longitude: -115.0825335134209,
          },
          image: "",
          tags: ["Bazinga", "Nevada"],
          addedByUserId: 1,
        },
        {
          title: "Test2",
          coords: {
            latitude: 36.24295547509843,
            longitude: -115.07727484978403,
          },
          image: "",
          tags: ["Las Vegas", "Nevada", "Test2"],
          addedByUserId: 0,
        },
      ],
      currentUser: {
        userName: "Berra",
        userId: 1,
        isAdmin: false,
      },
      modalinfo: {
        title: "",
        coords: {
          longitude: 0,
          latitude: 0,
        },
        index: 0,
        showDeleteButton: false,
      },
    });
  }
}

export default new DataStorage();
