import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    extend: {
      container: {
        center: true,
      },
    },
  },
  plugins: [],
} satisfies Config;
