import create from "zustand";
import { devtools } from "zustand/middleware";

const middleware_ = (f) => create(devtools(f, { name: "auth-storage" }));
// const middleware_ = (f) => create(devtools(f, { name: "auth-storage" }));
const mapStore = middleware_((set, get) => ({
  isAuthenticated: false,
  userLocation: [],
  polylineData: {},
  latLongData: {},
  showPolyline: false,
  userLiveLocation: {},
  updateUserLocation: (data) => {
    set({
      userLocation: data,
    });
  },
  setPolylineData: (data) => {
    set({
      polylineData: data,
    });
  },
  setShowPolyline: (data) => {
    set({
      showPolyline: data,
    });
  },
  latLongCoord: (data) => {
    set({
      latLongData: data,
    });
  },
  setUserLiveLocation: (data) => {
    set({
      userLiveLocation: data,
    });
  },
}));

export default mapStore;
