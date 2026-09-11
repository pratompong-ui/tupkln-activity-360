import React from "react";
import ReactDOM from "react-dom/client";
import "./storage-shim.js";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ติดตั้งเป็นแอปบนมือถือได้ และเปิดดูได้แม้สัญญาณขาดช่วง
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("ลงทะเบียน service worker ไม่สำเร็จ:", err);
    });
  });
}
