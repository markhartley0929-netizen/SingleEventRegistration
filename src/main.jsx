import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

console.log("BOOTSTRAP: start");

const rootEl = document.getElementById("root");
console.log("BOOTSTRAP: root element", rootEl);

if (!rootEl) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootEl);

console.log("BOOTSTRAP: before render");

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

console.log("BOOTSTRAP: after render");
