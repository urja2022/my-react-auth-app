import { useEffect } from "react";
import { AdminRole } from "src/utils/enum";
import create from "zustand";
import createContext from "zustand/context";
import { devtools, persist } from "zustand/middleware";
import axios, { AUTH_API_URL } from "../api/axios";

const { Provider, useStore } = createContext();

const middleware_ = (f) => create(devtools(persist(f, { name: "auth-storage" })));
// const middleware_ = (f) => create(devtools(f, { name: "auth-storage" }));

const authStore = middleware_((set, get) => ({
  isAuthenticated: false,
  isInitialized: false,
  user: {},
  method: "jwt",
  accessToken: "",
  role: "",
  adminRole:"",
  locationData: [],
  permissions: "",
  isRefreshing: false,
  setInitialized: () => set({ isInitialized: true }),
  login: async (loginObj) => {
    try {
      const response = await axios.post(AUTH_API_URL.login,
        JSON.stringify(loginObj), {
        headers: { "Content-Type": "application/json", "env": "test" },
        withCredentials: true,
      });
      const verify = response?.data?.isVerify;
      if (verify === 0) {
        return [response?.data, null];
      } else {
        set({
          user: response?.data?.user,
          isVerify: response?.data?.isVerify,
          accessToken: response?.data?.accessToken,
          role: response?.data?.usertype,
          adminRole:AdminRole.SUPER_ADMIN,
          isAuthenticated: true,
          permissions: response?.data?.permission
        });
        return [response?.data, null];
      }
    } catch (err) {
      if (err.response?.data?.message) {
        return [null, err.response?.data?.message];
      }
      if (!err?.response) {
        return [null, "No Server Response"];
      } else if (err.response?.status === 400) {
        return [null, "Missing user or Password"];
      } else if (err.response?.status === 409) {
        return [null, "Unauthorized"];
      } else {
        return [null, "Login Failed"];
      }
    }
  },
  register: async (signUpObj) => {
    try {
      const response = await axios.post(
        AUTH_API_URL.register,
        JSON.stringify(signUpObj),
        {
          headers: { "Content-Type": "application/json", "env": "test" },
          withCredentials: true,
        }
      );
      set({
        user: "",
        accessToken: "",
        role: "",
      });
      return [response.data.message, null];
    } catch (err) {
      return [null, err.response.data.errors];
    }
  },
  logout: () => {
    set({
      user: "",
      accessToken: "",
      role: "",
      locationData: "",
      adminRole:"",
      isAuthenticated: false,
      permissions: ""
    });
  },
  refreshToken: async () => {
    try {
      const response = await axios.get(AUTH_API_URL.refreshToken, { withCredentials: true })
      set({ accessToken: response?.data?.accessToken });
      return response?.data?.accessToken;
    } catch (error) {
      await get().logout()
    }
  },
  updateUserProfile: (data) => {
    set({
      user: data,
    })
  },
  businessId: (data) => {
    set({
      businessId: data,
    })
  },
  locationStoreData: async (data) => {
    set({
      locationData: data,
    })
  }
}));


const AuthProvider = ({ children }) => {
  const setInitialized = authStore(state => state.setInitialized)
  useEffect(() => {
    setInitialized()
  }, []);
  return <Provider createStore={() => authStore}>{children}</Provider>;
};

const refreshStore = create((set, get) => ({
  isRefreshing: false,
}))

export { AuthProvider, authStore, refreshStore };
export default useStore;
