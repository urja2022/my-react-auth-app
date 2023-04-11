import "./theme/styles/App.css";
import "@fontsource/inter";
import { SnackbarProvider } from "notistack";
// routes
import Router from "./routes";
// hooks
import useStore from "./contexts/AuthProvider";
// components
import LoadingScreen from "./components/LoadingScreen";
import SocketContextProvider from "./contexts/socketProvider";

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useStore();
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <SocketContextProvider>
          {isInitialized ? <Router /> : <LoadingScreen />}
        </SocketContextProvider>
      </SnackbarProvider>
    </>
  );
}
