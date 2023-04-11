import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ClientProvider from "./react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "normalize.css";

ReactDOM.render(
  <ClientProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools /> */}
  </ClientProvider>,
  document.getElementById("root")
);
