import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
import { light } from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "or-website": "#FAB400",
        darkText: "#FFF",
        darkButton: "rgb(29, 155, 240)",
        darkBg: "#000",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...light,
        },
      },
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)",
          secondary: "rgb(24, 24, 24)",
        },
      },
    ],
  },
};
