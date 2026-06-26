import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyTheme, getTheme } from "./lib/theme";

// Apply saved theme before first render to avoid flash
applyTheme(getTheme());

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
