
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Receiver from "./Receiver.jsx";
import "./index.css";

const isReceiver =
  new URLSearchParams(window.location.search).get("role") === "receiver";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isReceiver ? <Receiver /> : <App />}
  </StrictMode>
);
