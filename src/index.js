import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import "react-leaflet-fullscreen/dist/styles.css";

import App from "./App";
import { GlobalStateProvider } from "./services/Store"; 

const rootElement = document.getElementById("root");

ReactDOM.render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>,
  rootElement
);
