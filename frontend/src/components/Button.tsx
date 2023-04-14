import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      type="submit"
      className="mt-3 focus:outline-none ring-1 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 bg-purple-500 hover:opacity-70 text-white font-bold h-10 w-full rounded disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
