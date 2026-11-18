import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/cinematic.css";
import "./styles/monuments.css";
import "./styles/responsive.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
