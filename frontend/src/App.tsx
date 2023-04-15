import { Outlet } from "react-router-dom";
import { FormContextProvider } from "./contexts/form-context";
import { Toaster } from "react-hot-toast";

export function App() {
  return (
    <FormContextProvider>
			<header className="h-20 flex justify-center items-center">
				<h2 className="text-2xl text-white font-bold">Aluguel de Carros</h2>
			</header>
      <Outlet />
      <Toaster position="top-right" />
    </FormContextProvider>
  );
}
