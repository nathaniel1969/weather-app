import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { UnitProvider } from "./context/UnitContext"; // Import the provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UnitProvider>
    {" "}
    {/* Wrap App with UnitProvider */}
    <App />
  </UnitProvider>
);
