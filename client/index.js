import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import App from "./App";
import "./styles/main.css";

const container = document.getElementById("root");
if (!container) {
  document.body.innerHTML =
    '<div style="color: white; padding: 20px;">Error: Root element not found</div>';
} else {
  try {
    const root = createRoot(container);

    root.render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  } catch (error) {
    console.error("Error rendering React app:", error);
    document.body.innerHTML = `<div style="color: white; padding: 20px;">Error: ${error.message}</div>`;
  }
}
