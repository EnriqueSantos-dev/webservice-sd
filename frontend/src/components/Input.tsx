import React from "react";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      <input
        className="ring-1 ring-zinc-700 transition-colors hover:ring-purple-500 focus:ring-purple-500 text-white focus:outline-none rounded px-2 h-10 placeholder:text-zinc-500 bg-zinc-800 border-0 w-full"
        {...props}
        ref={ref}
      />

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}
    </div>
  )
);
