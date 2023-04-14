import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./global.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Step1 } from "./components/forms/Step1";
import { Step2 } from "./components/forms/Step2";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route path="/step1" element={<Step1 />} index />
      <Route path="/step2" element={<Step2 />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
