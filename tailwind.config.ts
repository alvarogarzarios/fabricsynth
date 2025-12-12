import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Victor Mono",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        victor: [
          "Victor Mono",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        syne: [
          "Syne Mono",
          "ui-monospace",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
