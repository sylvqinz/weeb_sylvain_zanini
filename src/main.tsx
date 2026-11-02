import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const configuredBaseName = import.meta.env.BASE_URL;
const routerBaseName = window.location.pathname.startsWith(configuredBaseName) ? configuredBaseName : "/";

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBaseName}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
