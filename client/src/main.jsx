import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./services/store";
import { Provider } from "react-redux"
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios"
import ScrollUp from "./components/scrollBtn/ScrollUp";

// axios.defaults.baseURL="https://project-marketplace-kappa.vercel.app/"
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "/"; // Use env var in production, local proxy in dev

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="483606787522-3i5g6kmdjhi23aqs240k809lhd0r9tva.apps.googleusercontent.com">
        <ScrollUp />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
