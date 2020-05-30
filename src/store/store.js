import { extendObservable } from "mobx";

class DataStorage {
  constructor() {
    extendObservable(this, {
      MapPins: [
        {
          pinTitle: "test",
          pinCoordinates: {
            y: "57.69882110471608",
            x: "11.977473309244896",
          },
          pinImage: "",
          pinTags: ["Bazinga", "Testing"],
          pinUser: 1,
          pinDescription: "",
          pinId: 1,
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
    });
  }
}

export default new DataStorage();
