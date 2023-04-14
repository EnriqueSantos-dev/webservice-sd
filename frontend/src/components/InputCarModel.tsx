import React from "react";
import { CarModel } from "../types";

interface InputCarModelProps
  extends Omit<CarModel, "value">,
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > {
  price: number;
  handleSelect: (model: string) => void;
  selectedModel: string;
}

export const InputCarModel = React.forwardRef<
  HTMLInputElement,
  InputCarModelProps
>(({ model, price, handleSelect, selectedModel, ...rest }, ref) => (
  <>
    <label
      tabIndex={0}
      htmlFor={model}
      key={model}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSelect(model);
        }
      }}
      className={`flex flex-col gap-2 text-white rounded-lg ring-1 focus:ring-purple-500 ring-zinc-700 p-6 hover:ring-purple-500 focus:outline-none focus:ring-offset-1 focus:ring-offset-zinc-800 cursor-pointer ${
        model === selectedModel ? "bg-purple-500" : " bg-zinc-800"
      }`}
    >
      <p className="text-xl/7 font-bold line-clamp-1 max-w-xs">{model}</p>
      <span className="text-sm font-bold text-yellow-300">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price)}{" "}
        / hora
      </span>
    </label>
    <input {...rest} ref={ref} />
  </>
));
