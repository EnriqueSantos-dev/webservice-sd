import { Outlet } from "react-router-dom";
import { FormContextProvider } from "./contexts/form-context";
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    <FormContextProvider>
      <Outlet />
      <Toaster position="top-right" />
    </FormContextProvider>
  );
}
