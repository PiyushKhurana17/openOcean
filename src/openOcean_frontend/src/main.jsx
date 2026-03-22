import { Buffer } from "buffer";
window.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Principal } from "@dfinity/principal";

export const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
