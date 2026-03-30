import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LaMORKSWebsite from "./LaMORKS.jsx";
import AdminPanel from "./AdminPanel.jsx";
import HomePage from "./HomePage.jsx";
import AnimationPage from "./AnimationPage.jsx";

const path = window.location.pathname;

let Page;
if (path === "/admin") {
  Page = <AdminPanel />;
} else if (path === "/technology") {
  Page = <LaMORKSWebsite />;
} else if (path === "/animation") {
  Page = <AnimationPage />;
} else {
  Page = <HomePage />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>{Page}</StrictMode>
);
